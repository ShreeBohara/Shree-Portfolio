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

interface DurableRateLimitEntry {
  minute: RateLimitEntry;
  day: RateLimitEntry;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const durableRateLimitStore = new Map<string, DurableRateLimitEntry>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // per identifier per window
const DAILY_LIMIT = 60; // per identifier per day
const DAILY_WINDOW = 24 * 60 * 60 * 1000;

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
    const result = body?.[0]?.result;
    const count = typeof result === 'number' || typeof result === 'string' ? Number(result) : NaN;
    return Number.isSafeInteger(count) && count > 0 ? count : null;
  } catch {
    // Never let the limiter take the endpoint down; fall back to memory.
    return null;
  }
}

function checkInMemory(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return false;

  entry.count += 1;
  return true;
}

function recordDurableLimit(identifier: string, entry: DurableRateLimitEntry): void {
  const previous = durableRateLimitStore.get(identifier);
  // Concurrent requests may finish out of order. Keep the newest window and
  // highest observed count so a slower response cannot replenish the quota.
  const latest = (old: RateLimitEntry | undefined, current: RateLimitEntry): RateLimitEntry => {
    if (!old || current.resetTime > old.resetTime) return current;
    if (current.resetTime < old.resetTime) return old;
    return { count: Math.max(old.count, current.count), resetTime: current.resetTime };
  };
  durableRateLimitStore.set(identifier, {
    minute: latest(previous?.minute, entry.minute),
    day: latest(previous?.day, entry.day),
  });
}

/** Returns true when the request is allowed. */
export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (isDurableLimiterConfigured()) {
    const now = Date.now();
    const minuteWindow = Math.floor(now / RATE_LIMIT_WINDOW);
    const dayWindow = Math.floor(now / DAILY_WINDOW);
    const minuteKey = `chat:min:${identifier}:${minuteWindow}`;
    const dayKey = `chat:day:${identifier}:${new Date(now).toISOString().slice(0, 10)}`;

    const [minuteCount, dayCount] = await Promise.all([
      incrementWithExpiry(minuteKey, 60),
      incrementWithExpiry(dayKey, 86_400),
    ]);

    // If either counter is unavailable, fall through to the local limiter.
    if (minuteCount !== null && dayCount !== null) {
      recordDurableLimit(identifier, {
        minute: { count: minuteCount, resetTime: (minuteWindow + 1) * RATE_LIMIT_WINDOW },
        day: { count: dayCount, resetTime: (dayWindow + 1) * DAILY_WINDOW },
      });
      return minuteCount <= RATE_LIMIT_MAX_REQUESTS && dayCount <= DAILY_LIMIT;
    }
  }

  // These getters must describe the limiter that made this decision.
  durableRateLimitStore.delete(identifier);
  return checkInMemory(identifier);
}

export function getRemainingRequests(identifier: string): number {
  const now = Date.now();
  const durable = durableRateLimitStore.get(identifier);
  if (durable) {
    const minuteRemaining = now >= durable.minute.resetTime
      ? RATE_LIMIT_MAX_REQUESTS
      : Math.max(0, RATE_LIMIT_MAX_REQUESTS - durable.minute.count);
    const dayRemaining = now >= durable.day.resetTime
      ? DAILY_LIMIT
      : Math.max(0, DAILY_LIMIT - durable.day.count);
    return Math.min(minuteRemaining, dayRemaining);
  }
  const entry = rateLimitStore.get(identifier);
  if (!entry || now >= entry.resetTime) return RATE_LIMIT_MAX_REQUESTS;
  return Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
}

export function getResetTime(identifier: string): number {
  const now = Date.now();
  const durable = durableRateLimitStore.get(identifier);
  if (durable) {
    // A depleted daily budget stays depleted after the minute window changes.
    if (now < durable.day.resetTime && durable.day.count >= DAILY_LIMIT) {
      return durable.day.resetTime;
    }
    return (Math.floor(now / RATE_LIMIT_WINDOW) + 1) * RATE_LIMIT_WINDOW;
  }
  const entry = rateLimitStore.get(identifier);
  if (!entry || now >= entry.resetTime) return now + RATE_LIMIT_WINDOW;
  return entry.resetTime;
}

export function getRateLimitMax(): number {
  return RATE_LIMIT_MAX_REQUESTS;
}
