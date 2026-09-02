/**
 * Rate limiting for the chat endpoint.
 *
 * Two tiers:
 *  - Upstash Redis (durable, shared across serverless instances) when
 *    UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 *  - An in-memory map otherwise, which only limits within one warm instance.
 *
 * The in-memory limiter was the only tier before; on Vercel it resets on every
 * cold start and is not shared between concurrent instances, so it was advisory
 * at best. Setting the two env vars upgrades this without a code change.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // per identifier per window
const DAILY_LIMIT = 60; // per identifier per day

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export function isDurableLimiterConfigured(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

/** One Upstash pipeline call: INCR the key and set its TTL on first use. */
async function incrementWithExpiry(key: string, ttlSeconds: number): Promise<number | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;

  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(ttlSeconds), 'NX'],
      ]),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const body = (await res.json()) as { result?: unknown }[];
    const count = Number(body?.[0]?.result);
    return Number.isFinite(count) ? count : null;
  } catch {
    // Never let the limiter take the endpoint down; fall back to memory.
    return null;
  }
}

function checkInMemory(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return false;

  entry.count += 1;
  return true;
}

/** Returns true when the request is allowed. */
export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (isDurableLimiterConfigured()) {
    const minuteKey = `chat:min:${identifier}:${Math.floor(Date.now() / RATE_LIMIT_WINDOW)}`;
    const dayKey = `chat:day:${identifier}:${new Date().toISOString().slice(0, 10)}`;

    const [minuteCount, dayCount] = await Promise.all([
      incrementWithExpiry(minuteKey, 60),
      incrementWithExpiry(dayKey, 86_400),
    ]);

    // If Upstash is unreachable both come back null; fall through to memory.
    if (minuteCount !== null && dayCount !== null) {
      return minuteCount <= RATE_LIMIT_MAX_REQUESTS && dayCount <= DAILY_LIMIT;
    }
  }

  return checkInMemory(identifier);
}

export function getRemainingRequests(identifier: string): number {
  const entry = rateLimitStore.get(identifier);
  if (!entry || Date.now() > entry.resetTime) return RATE_LIMIT_MAX_REQUESTS;
  return Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
}

export function getResetTime(identifier: string): number {
  const entry = rateLimitStore.get(identifier);
  if (!entry || Date.now() > entry.resetTime) return Date.now() + RATE_LIMIT_WINDOW;
  return entry.resetTime;
}

export function getRateLimitMax(): number {
  return RATE_LIMIT_MAX_REQUESTS;
}
