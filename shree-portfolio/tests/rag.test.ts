import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import type { RetrievedChunk, retrieveRelevantContent } from '../src/lib/ai/retrieval';
import type { ChatContext } from '../src/lib/ai/rag';

type RagModule = typeof import('../src/lib/ai/rag');
type ChatRoute = typeof import('../src/app/api/chat/route');
type RetrievalOptions = Parameters<typeof retrieveRelevantContent>[1];
type ModelRequest = { stream?: boolean; messages: Array<{ content: string }> };

// Evaluate the real modules with explicit service substitutes. An unmocked
// dependency fails the test instead of reaching OpenAI, Supabase or Redis.
function loadModule<T>(file: string, dependencies: Record<string, unknown>, globals: Record<string, unknown> = {}): T {
  const compiledModule = { exports: {} };
  const filename = resolve(file);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText;

  runInNewContext(code, {
    module: compiledModule,
    exports: compiledModule.exports,
    require: (name: string) => {
      if (!(name in dependencies)) throw new Error(`Unmocked dependency: ${name}`);
      return dependencies[name];
    },
    console: { log() {}, warn() {}, error() {} },
    Response,
    TextEncoder,
    ReadableStream,
    Date,
    Error,
    AbortController,
    ...globals,
  }, { filename });
  return compiledModule.exports as T;
}

const chunk: RetrievedChunk = {
  content: 'Project: Selected project. A documented implementation.',
  metadata: { type: 'project', itemId: 'project-selected', title: 'Selected project' },
  similarity: 0.35,
};
const selectedContext: ChatContext = {
  enabled: true,
  itemType: 'project',
  itemId: chunk.metadata.itemId,
};

function harness(options: {
  configured?: boolean;
  vectorAvailable?: boolean;
  retrieval?: (query: string, options: RetrievalOptions) => Promise<RetrievedChunk[]>;
  modelFailure?: 'before' | 'after' | 'empty';
  modelWaitForAbort?: boolean;
} = {}) {
  const retrievalCalls: Array<{ query: string; options: RetrievalOptions }> = [];
  const modelRequests: ModelRequest[] = [];
  const providerSignals: Array<AbortSignal | undefined> = [];
  const streamStats = { enqueuesAfterCancel: 0 };
  class TrackedReadableStream extends ReadableStream<Uint8Array> {
    constructor(source: UnderlyingDefaultSource<Uint8Array>) {
      let cancelled = false;
      super({
        ...source,
        start(controller) {
          const trackedController = new Proxy(controller, {
            get(target, property) {
              if (property === 'enqueue') return (value: Uint8Array) => {
                if (cancelled) streamStats.enqueuesAfterCancel += 1;
                target.enqueue(value);
              };
              const value = Reflect.get(target, property, target);
              return typeof value === 'function' ? value.bind(target) : value;
            },
          });
          return source.start?.(trackedController);
        },
        cancel(reason) {
          cancelled = true;
          return source.cancel?.(reason);
        },
      });
    }
  }
  const config = loadModule<typeof import('../src/lib/ai/config')>('src/lib/ai/config.ts', {});
  const retrieval = loadModule<typeof import('../src/lib/ai/retrieval')>('src/lib/ai/retrieval.ts', {
    './embeddings': {},
    './vector-store': {},
    './config': config,
  });
  const mockedRetrieval = {
    ...retrieval,
    retrieveRelevantContent: async (query: string, retrievalOptions: RetrievalOptions) => {
      retrievalCalls.push({ query, options: retrievalOptions });
      return options.retrieval ? options.retrieval(query, retrievalOptions) : [chunk];
    },
  };
  const prompts = loadModule<typeof import('../src/lib/ai/prompts')>('src/lib/ai/prompts.ts', {
    './retrieval': mockedRetrieval,
    './config': config,
  });
  const portfolio = loadModule<typeof import('../src/data/portfolio')>('src/data/portfolio.ts', {});
  const chunking = loadModule<typeof import('../src/lib/ai/chunking')>('src/lib/ai/chunking.ts', {});
  const rag = loadModule<RagModule>('src/lib/ai/rag.ts', {
    './retrieval': mockedRetrieval,
    './prompts': prompts,
    './config': config,
    '@/data/portfolio': portfolio,
    './chunking': chunking,
    './vector-store': { isVectorStoreAvailable: () => options.vectorAvailable !== false },
    './client': {
      isOpenAIConfigured: () => options.configured !== false,
      getOpenAIClient: () => ({
        chat: { completions: { create: async (request: ModelRequest, requestOptions?: { signal?: AbortSignal }) => {
          modelRequests.push(request);
          providerSignals.push(requestOptions?.signal);
          if (options.modelFailure === 'before') throw new Error('Private provider error');
          if (!request.stream) return { choices: [{ message: { content: 'A grounded answer.' } }] };
          return (async function* () {
            if (options.modelFailure === 'empty') return;
            yield { choices: [{ delta: { content: 'A grounded answer.' } }] };
            if (options.modelWaitForAbort) {
              await new Promise<void>((_resolve, reject) => {
                const signal = requestOptions?.signal;
                if (!signal) return reject(new Error('Provider signal missing'));
                if (signal.aborted) return reject(new Error('Provider cancelled'));
                signal.addEventListener('abort', () => reject(new Error('Provider cancelled')), { once: true });
              });
            }
            if (options.modelFailure === 'after') throw new Error('Private provider error');
          })();
        } } },
      }),
    },
  });
  const route = loadModule<ChatRoute>('src/app/api/chat/route.ts', {
    '@/lib/ai/rag': rag,
    '@/lib/ai/retrieval': mockedRetrieval,
    '@/lib/ai/rate-limit': {
      checkRateLimit: async () => true,
      getRemainingRequests: () => 10,
      getResetTime: () => Date.now() + 60_000,
      getRateLimitMax: () => 10,
    },
    '@/lib/ai/deny': { checkDenyList: () => null },
  }, { ReadableStream: TrackedReadableStream });
  return { rag, route, retrievalCalls, modelRequests, portfolio, providerSignals, streamStats };
}

async function request(route: ChatRoute, stream = true, context?: ChatContext) {
  const req = new Request('https://portfolio.example/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'How was this implementation built?', context, stream }),
  });
  return route.POST(req as Parameters<ChatRoute['POST']>[0]);
}

async function events(response: Response) {
  return (await response.text()).trim().split('\n').map((line) => JSON.parse(line));
}

test('missing services return the availability message in both response modes without retrieval or generation', async () => {
  for (const options of [{ configured: false }, { vectorAvailable: false }]) {
    const { route, retrievalCalls, modelRequests } = harness(options);
    const streaming = await request(route);
    assert.equal(streaming.status, 200);
    const streamed = await events(streaming);
    assert.deepEqual(streamed.map((event) => event.type), ['metadata', 'chunk', 'done']);
    assert.deepEqual(streamed[0].citations, []);
    assert.match(streamed[1].content, /assistant is unavailable/);
    const ordinary = await request(route, false);
    assert.match((await ordinary.json()).answer, /assistant is unavailable/);
    assert.equal(retrievalCalls.length, 0);
    assert.equal(modelRequests.length, 0);
  }
});

test('a retrieval outage is handled before streaming and never reaches the model', async () => {
  const { route, modelRequests } = harness({ retrieval: async () => { throw new Error('Private database error'); } });
  const response = await request(route);
  assert.equal(response.status, 200);
  const streamed = await events(response);
  assert.deepEqual(streamed[0].citations, []);
  assert.match(streamed[1].content, /assistant is unavailable/);
  assert.doesNotMatch(streamed[1].content, /Private database/);
  assert.equal(modelRequests.length, 0);
});

test('fallback retrieval retains the selected item and its sources match streaming and nonstreaming answers', async () => {
  const { route, retrievalCalls, modelRequests } = harness({
    retrieval: async (_query, options) => options?.minScore === 0.25 ? [chunk] : [],
  });
  const streamed = await events(await request(route, true, selectedContext));
  assert.deepEqual(streamed[0].citations, [{ type: 'project', id: chunk.metadata.itemId, title: chunk.metadata.title }]);
  assert.equal(retrievalCalls.length, 2, 'no new retrieval happens after metadata');
  for (const call of retrievalCalls) {
    assert.equal(call.options?.filter?.itemId, selectedContext.itemId);
    assert.equal(call.options?.filter?.type, selectedContext.itemType);
    assert.equal(call.options?.boostItemId, selectedContext.itemId);
  }
  assert.match(modelRequests[0].messages[1].content, /A documented implementation/);
  const ordinary = await (await request(route, false, selectedContext)).json();
  assert.deepEqual(ordinary.citations, streamed[0].citations);
  assert.equal(retrievalCalls.length, 4);
  assert.equal(modelRequests[0].messages[1].content, modelRequests[1].messages[1].content);
});

test('empty retrieval returns an honest no-match reply without ungrounded generation in either mode', async () => {
  const { route, retrievalCalls, modelRequests } = harness({ retrieval: async () => [] });
  const streamed = await events(await request(route, true, selectedContext));
  assert.deepEqual(streamed[0].citations, []);
  assert.match(streamed[1].content, /couldn't find supporting material/);
  const ordinary = await (await request(route, false, selectedContext)).json();
  assert.equal(ordinary.answer, streamed[1].content);
  assert.equal(ordinary.confidence, 0);
  assert.equal(retrievalCalls.length, 4);
  assert.equal(modelRequests.length, 0);
});

test('project overview keeps its grounded static fallback without an unrelated retry', async () => {
  const { rag, retrievalCalls, modelRequests } = harness({ retrieval: async () => [] });
  const prepared = await rag.prepareRAGContext('What are the top projects?');
  assert.ok(prepared.chunks.length > 0);
  assert.ok(prepared.chunks.every((item) => item.metadata.type === 'project'));
  assert.equal(prepared.fallback, undefined);
  assert.equal(retrievalCalls.length, 1);
  const answer = await rag.getRAGResponse('What are the top projects?', undefined, prepared);
  assert.ok(answer.citations.length > 0);
  assert.equal(retrievalCalls.length, 1);
  assert.equal(modelRequests.length, 1);
});

test('generation failures and empty model streams emit safe errors and never report successful completion', async () => {
  for (const modelFailure of ['before', 'after', 'empty'] as const) {
    const { route } = harness({ modelFailure });
    const streamed = await events(await request(route));
    const error = streamed.find((event) => event.type === 'error');
    assert.ok(error, modelFailure);
    assert.match(error.error, /assistant is unavailable/);
    assert.doesNotMatch(error.error, /Private provider/);
    assert.ok(!streamed.some((event) => event.type === 'done'));
    assert.ok(!streamed.some((event) => event.type === 'chunk' && /assistant is unavailable/.test(event.content)));
  }
});

test('an explicitly empty prepared context cannot bypass the grounding guard', async () => {
  const { rag, modelRequests, retrievalCalls } = harness();
  const answer = await rag.getRAGResponse('A question', undefined, { chunks: [] });
  assert.equal(answer.confidence, 0);
  const streamed: string[] = [];
  for await (const content of rag.streamRAGResponse('A question', undefined, { chunks: [] })) streamed.push(content);
  assert.equal(streamed[0], answer.answer);
  assert.equal(modelRequests.length, 0);
  assert.equal(retrievalCalls.length, 0);
});

test('known selected pages use their local content when global capped retrieval misses them', async () => {
  const { route, retrievalCalls, modelRequests, portfolio } = harness({ retrieval: async () => [] });
  for (const [itemType, items] of [
    ['project', portfolio.projects],
    ['experience', portfolio.experiences],
    ['education', portfolio.education],
  ] as const) {
    const context: ChatContext = { enabled: true, itemType, itemId: items[0].id };
    const streamed = await events(await request(route, true, context));
    assert.equal(streamed[0].citations.length, 1);
    assert.equal(streamed[0].citations[0].id, context.itemId);
    assert.equal(streamed[0].citations[0].type, itemType);
    const ordinary = await (await request(route, false, context)).json();
    assert.deepEqual(ordinary.citations, streamed[0].citations);
    assert.equal(ordinary.confidence, 0.5, 'local scope matching is not a measured semantic score');
  }
  assert.equal(retrievalCalls.length, 6, 'known pages need no lower-threshold query');
  for (let index = 0; index < modelRequests.length; index += 2) {
    assert.equal(modelRequests[index].messages[1].content, modelRequests[index + 1].messages[1].content);
  }
});

test('invalid chat request bodies, query strings, stream flags and enabled contexts return 400 without service calls', async () => {
  const { route, retrievalCalls, modelRequests } = harness();
  const invalidBodies = [
    '{',
    'null',
    '[]',
    JSON.stringify({ query: '   ' }),
    JSON.stringify({ query: 42 }),
    JSON.stringify({ query: 'Question', stream: 'true' }),
    JSON.stringify({ query: 'Question', stream: null }),
    JSON.stringify({ query: 'Question', context: 'project' }),
    JSON.stringify({ query: 'Question', context: { enabled: 'true' } }),
    JSON.stringify({ query: 'Question', context: { enabled: true, itemType: 'bio', itemId: 'bio' } }),
    JSON.stringify({ query: 'Question', context: { enabled: true, itemType: ['project'], itemId: 'project' } }),
    JSON.stringify({ query: 'Question', context: { enabled: true, itemType: 'project', itemId: ' ' } }),
  ];
  for (const body of invalidBodies) {
    const response = await route.POST(new Request('https://portfolio.example/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
    }) as Parameters<ChatRoute['POST']>[0]);
    assert.equal(response.status, 400, body);
  }
  assert.equal(retrievalCalls.length, 0);
  assert.equal(modelRequests.length, 0);
});

test('disabled client context with null item fields remains valid and queries are trimmed', async () => {
  const { route, retrievalCalls } = harness();
  const response = await route.POST(new Request('https://portfolio.example/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '  A valid question  ', context: { enabled: false, itemId: null, itemType: null } }),
  }) as Parameters<ChatRoute['POST']>[0]);
  assert.equal(response.status, 200);
  await response.text();
  assert.equal(retrievalCalls[0].query, 'A valid question');
  assert.equal(retrievalCalls[0].options?.filter, undefined);
});

test('cancelling the response aborts provider generation without enqueuing after cancellation', async () => {
  const { route, providerSignals, streamStats } = harness({ modelWaitForAbort: true });
  const response = await request(route);
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  assert.equal(JSON.parse(decoder.decode((await reader.read()).value)).type, 'metadata');
  assert.equal(JSON.parse(decoder.decode((await reader.read()).value)).type, 'chunk');
  assert.ok(providerSignals[0]);
  assert.equal(providerSignals[0].aborted, false);
  await reader.cancel('Visitor reset the chat');
  assert.equal(providerSignals[0].aborted, true);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(streamStats.enqueuesAfterCancel, 0);
  assert.equal((await reader.read()).done, true);
});

test('an aborted HTTP request aborts provider generation and closes without error or completion events', async () => {
  const { route, providerSignals } = harness({ modelWaitForAbort: true });
  const abortController = new AbortController();
  const req = new Request('https://portfolio.example/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'A valid question' }), signal: abortController.signal,
  });
  const response = await route.POST(req as Parameters<ChatRoute['POST']>[0]);
  const reader = response.body!.getReader();
  await reader.read(); // metadata
  await reader.read(); // first partial answer
  abortController.abort();
  assert.equal(providerSignals[0]?.aborted, true);
  assert.equal((await reader.read()).done, true, 'aborted generation emits no further chunks, error or done events');
});
