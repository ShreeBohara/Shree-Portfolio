import type { Citation } from '@/data/types';

type ChatStreamEvent =
  | { type: 'metadata'; citations: Citation[] }
  | { type: 'chunk'; content: string }
  | { type: 'done' };

function parseEvent(line: string): ChatStreamEvent {
  let event: unknown;
  try {
    event = JSON.parse(line);
  } catch {
    throw new Error('The assistant sent an invalid response. Please try again.');
  }

  if (!event || typeof event !== 'object' || !('type' in event)) {
    throw new Error('The assistant sent an invalid response. Please try again.');
  }
  if (event.type === 'error') {
    throw new Error('error' in event && typeof event.error === 'string'
      ? event.error : 'The assistant could not finish the answer. Please try again.');
  }
  if (event.type === 'metadata' && 'citations' in event && Array.isArray(event.citations)) {
    return { type: 'metadata', citations: event.citations };
  }
  if (event.type === 'chunk' && 'content' in event && typeof event.content === 'string') {
    return { type: 'chunk', content: event.content };
  }
  if (event.type === 'done') return { type: 'done' };
  throw new Error('The assistant sent an invalid response. Please try again.');
}

/** Read NDJSON across network/UTF-8 boundaries; failures reach the retry UI. */
export async function* readChatResponse(response: Response): AsyncGenerator<ChatStreamEvent> {
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    if (body && typeof body === 'object') {
      if ('message' in body && typeof body.message === 'string') throw new Error(body.message);
      if ('error' in body && typeof body.error === 'string') throw new Error(body.error);
    }
    throw new Error(`The assistant could not respond (${response.status}). Please try again.`);
  }
  if (!response.body) throw new Error('The assistant returned no answer. Please try again.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;
  let hasContent = false;
  try {
    while (!completed) {
      const { done, value } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      if (done && buffer.trim()) {
        lines.push(buffer);
        buffer = '';
      }
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = parseEvent(line);
        if (event.type === 'chunk' && event.content.trim()) hasContent = true;
        if (event.type === 'done') {
          if (!hasContent) throw new Error('The assistant returned no answer. Please try again.');
          completed = true;
        }
        yield event;
        if (completed) break;
      }
      if (done) break;
    }
    if (!completed) throw new Error('The answer was interrupted. Please try again.');
  } finally {
    // Stop the request on an error or when the consumer closes the iterator.
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
