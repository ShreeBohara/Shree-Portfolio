import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readChatResponse } from '../src/lib/ai/chat-stream';

function streamResponse(text: string, splitEvery = 1): Response {
  const bytes = new TextEncoder().encode(text);
  return new Response(new ReadableStream({
    start(controller) {
      for (let i = 0; i < bytes.length; i += splitEvery) {
        controller.enqueue(bytes.slice(i, i + splitEvery));
      }
      controller.close();
    },
  }));
}

async function collect(response: Response) {
  const events = [];
  for await (const event of readChatResponse(response)) events.push(event);
  return events;
}

test('reads split UTF-8 and the last event without a newline', async () => {
  const events = await collect(streamResponse(
    '{"type":"metadata","citations":[]}\n' +
    '{"type":"chunk","content":"Hello 世界 👋"}\n' +
    '{"type":"done"}',
  ));
  assert.deepEqual(events, [
    { type: 'metadata', citations: [] },
    { type: 'chunk', content: 'Hello 世界 👋' },
    { type: 'done' },
  ]);
});

test('surfaces server stream errors after partial content', async () => {
  await assert.rejects(collect(streamResponse(
    '{"type":"chunk","content":"Partial answer"}\n' +
    '{"type":"error","error":"Service unavailable"}\n',
  )), /Service unavailable/);
});

test('rejects an interrupted stream instead of showing partial success', async () => {
  await assert.rejects(collect(streamResponse('{"type":"chunk","content":"Partial"}\n')), /interrupted/);
});

test('rejects empty answers and malformed events', async () => {
  await assert.rejects(collect(streamResponse('{"type":"metadata","citations":[]}\n{"type":"done"}\n')), /no answer/);
  await assert.rejects(collect(streamResponse('bad-json\n')), /invalid response/);
  await assert.rejects(collect(streamResponse('{"type":"chunk","content":42}\n')), /invalid response/);
});

test('shows the API quota message and handles non-JSON failures', async () => {
  await assert.rejects(collect(new Response(JSON.stringify({ error: 'Rate limit exceeded', message: 'Try again tomorrow' }), { status: 429 })), /Try again tomorrow/);
  await assert.rejects(collect(new Response('Bad gateway', { status: 502 })), /502/);
});

test('closing the answer iterator cancels the underlying response', async () => {
  let cancelled = false;
  const response = new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"type":"chunk","content":"Partial"}\n'));
    },
    cancel() { cancelled = true; },
  }));
  for await (const event of readChatResponse(response)) {
    assert.equal(event.type, 'chunk');
    break;
  }
  assert.equal(cancelled, true);
});
