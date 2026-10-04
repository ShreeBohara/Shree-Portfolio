import assert from 'node:assert/strict';
import { after, afterEach, before, mock, test } from 'node:test';

const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
let limiter: typeof import('../src/lib/ai/rate-limit');

before(async () => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://rate-limit-test.invalid';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  limiter = await import('../src/lib/ai/rate-limit');
});

afterEach(() => mock.restoreAll());
after(() => {
  if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
  else process.env.UPSTASH_REDIS_REST_URL = originalUrl;
  if (originalToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
  else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
});

function mockCounts(now: number, minuteCount: number, dayCount: number): void {
  mock.method(Date, 'now', () => now);
  mock.method(globalThis, 'fetch', async (_input: RequestInfo | URL, init?: RequestInit) => {
    const commands = JSON.parse(String(init?.body)) as string[][];
    const count = commands[0][1].startsWith('chat:min:') ? minuteCount : dayCount;
    return new Response(JSON.stringify([{ result: count }, { result: 1 }]));
  });
}

test('a durable minute rejection reports zero remaining and the actual minute boundary', async () => {
  const now = Date.parse('2026-10-04T20:15:37.000Z');
  mockCounts(now, 11, 20);

  assert.equal(await limiter.checkRateLimit('minute-rejection'), false);
  assert.equal(limiter.getRemainingRequests('minute-rejection'), 0);
  assert.equal(limiter.getResetTime('minute-rejection'), Date.parse('2026-10-04T20:16:00.000Z'));
});

test('a daily rejection remains blocked across minute windows until UTC midnight', async () => {
  let now = Date.parse('2026-10-04T20:15:37.000Z');
  mockCounts(now, 2, 61);
  mock.method(Date, 'now', () => now);

  assert.equal(await limiter.checkRateLimit('daily-rejection'), false);
  const midnight = Date.parse('2026-10-05T00:00:00.000Z');
  assert.equal(limiter.getRemainingRequests('daily-rejection'), 0);
  assert.equal(limiter.getResetTime('daily-rejection'), midnight);

  now += 60_000;
  assert.equal(limiter.getRemainingRequests('daily-rejection'), 0);
  assert.equal(limiter.getResetTime('daily-rejection'), midnight);

  now = midnight;
  assert.equal(limiter.getRemainingRequests('daily-rejection'), 10);
  assert.equal(limiter.getResetTime('daily-rejection'), midnight + 60_000);
});

test('remaining requests respect the smaller durable daily budget', async () => {
  const now = Date.parse('2026-10-04T20:15:37.000Z');
  mockCounts(now, 2, 59);

  assert.equal(await limiter.checkRateLimit('last-daily-request'), true);
  assert.equal(limiter.getRemainingRequests('last-daily-request'), 1);
});

test('an Upstash outage reports the local fallback and it resets exactly at expiry', async () => {
  let now = Date.parse('2026-10-04T20:15:37.000Z');
  mockCounts(now, 2, 61);
  mock.method(Date, 'now', () => now);
  assert.equal(await limiter.checkRateLimit('fallback'), false);

  mock.method(globalThis, 'fetch', async () => { throw new Error('mock outage'); });
  for (let i = 0; i < 10; i += 1) {
    assert.equal(await limiter.checkRateLimit('fallback'), true);
    assert.equal(limiter.getRemainingRequests('fallback'), 9 - i);
  }
  assert.equal(await limiter.checkRateLimit('fallback'), false);
  assert.equal(limiter.getResetTime('fallback'), now + 60_000);

  now += 60_000;
  assert.equal(limiter.getRemainingRequests('fallback'), 10);
  assert.equal(await limiter.checkRateLimit('fallback'), true);
  assert.equal(limiter.getRemainingRequests('fallback'), 9);
});

test('a null Redis result is a failure rather than a zero request count', async () => {
  const now = Date.parse('2026-10-04T20:15:37.000Z');
  mock.method(Date, 'now', () => now);
  mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify([{ result: null }])));

  assert.equal(await limiter.checkRateLimit('malformed-counter'), true);
  assert.equal(limiter.getRemainingRequests('malformed-counter'), 9);
  assert.equal(limiter.getResetTime('malformed-counter'), now + 60_000);
});

test('out-of-order durable replies cannot restore requests already consumed', async () => {
  const now = Date.parse('2026-10-04T20:15:37.000Z');
  mock.method(Date, 'now', () => now);
  const replies: ((count: number) => void)[] = [];
  mock.method(globalThis, 'fetch', () => new Promise<Response>(resolve => {
    replies.push(count => resolve(new Response(JSON.stringify([{ result: count }, { result: 1 }]))));
  }));

  const earlier = limiter.checkRateLimit('concurrent');
  const later = limiter.checkRateLimit('concurrent');
  assert.equal(replies.length, 4);
  replies[2](11);
  replies[3](52);
  assert.equal(await later, false);
  replies[0](8);
  replies[1](50);
  assert.equal(await earlier, true);
  assert.equal(limiter.getRemainingRequests('concurrent'), 0);
  assert.equal(limiter.getResetTime('concurrent'), Date.parse('2026-10-04T20:16:00.000Z'));
});
