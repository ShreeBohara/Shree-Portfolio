import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import type { RetrievedChunk, retrieveRelevantContent } from '../src/lib/ai/retrieval';
import type { ChatContext } from '../src/lib/ai/rag';
import type { Citation } from '../src/data/types';
import { chunkProject } from '../src/lib/ai/chunking';

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
  modelFailure?: 'before' | 'after' | 'empty' | 'whitespace';
  modelWaitForAbort?: boolean;
  modelAnswer?: string;
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
  const projectCatalog = loadModule<typeof import('../src/data/projects')>('src/data/projects.ts', {});
  const portfolio = loadModule<typeof import('../src/data/portfolio')>('src/data/portfolio.ts', {
    './projects': projectCatalog,
  });
  const chunking = loadModule<typeof import('../src/lib/ai/chunking')>('src/lib/ai/chunking.ts', {});
  const retrieval = loadModule<typeof import('../src/lib/ai/retrieval')>('src/lib/ai/retrieval.ts', {
    './embeddings': {},
    './vector-store': {},
    './config': config,
    '@/data/portfolio': portfolio,
    './chunking': chunking,
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
          if (!request.stream) {
            const answer = options.modelFailure === 'empty' ? '' :
              options.modelFailure === 'whitespace' ? ' \n\t ' : options.modelAnswer ?? 'A grounded answer.';
            return { choices: [{ message: { content: answer } }] };
          }
          return (async function* () {
            if (options.modelFailure === 'empty') return;
            yield { choices: [{ delta: { content: options.modelFailure === 'whitespace' ? ' \n\t ' : options.modelAnswer ?? 'A grounded answer.' } }] };
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

async function request(
  route: ChatRoute,
  stream = true,
  context?: ChatContext,
  query = 'How was this implementation built?'
) {
  const req = new Request('https://portfolio.example/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, context, stream }),
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

test('project overview uses current catalog context without an unrelated saved-index query', async () => {
  const { rag, retrievalCalls, modelRequests } = harness({ retrieval: async () => [] });
  const prepared = await rag.prepareRAGContext('What are the top projects?');
  assert.ok(prepared.chunks.length > 0);
  assert.ok(prepared.chunks.every((item) => item.metadata.type === 'project'));
  assert.equal(prepared.fallback, undefined);
  assert.equal(retrievalCalls.length, 0);
  const answer = await rag.getRAGResponse('What are the top projects?', undefined, prepared);
  assert.ok(answer.citations.length > 0);
  assert.equal(retrievalCalls.length, 0);
  assert.equal(modelRequests.length, 1);
});

test('category overviews keep evidence scope, attribution and links instead of unrelated semantic hits', async () => {
  const { rag, portfolio, retrievalCalls, modelRequests } = harness({ retrieval: async () => [chunk] });
  for (const [query, category] of [
    ['What are the top AI/ML projects?', 'AI/ML'],
    ['What are the best academic projects?', 'Academic'],
    ['What are the featured data engineering projects?', 'Data Engineering'],
  ]) {
    const prepared = await rag.prepareRAGContext(query);
    assert.ok(prepared.chunks.length > 0);
    assert.ok(prepared.chunks.every(item => item.metadata.category === category));
    const matchedIds = new Set(prepared.chunks.map(item => item.metadata.itemId));
    assert.ok(matchedIds.size <= 3);
    const answer = await rag.getRAGResponse(query, undefined, prepared);
    assert.equal(answer.confidence, 0.5, 'catalog ordering must not imply measured answer accuracy');
    const prompt = modelRequests.at(-1)!.messages[1].content;
    for (const id of matchedIds) {
      const project = portfolio.projects.find(item => item.id === id);
      assert.ok(project);
      assert.ok(prompt.includes(project.impact), 'a metric cannot lose its qualification');
      assert.ok(prompt.includes(project.myRole), 'a team result cannot lose attribution');
      assert.ok(prompt.includes(`/projects/${project.slug}`));
    }
  }
  assert.equal(retrievalCalls.length, 0);
});

test('an overview with an unrecognized topic qualifier keeps semantic scope instead of unrelated featured projects', async () => {
  const { projects } = await import('../src/data/portfolio');
  const project = projects.find(item => item.id === 'project-duckdb');
  assert.ok(project);
  const { rag, retrievalCalls } = harness({
    retrieval: async () => [{ ...chunkProject(project)[0], similarity: 0.8 }],
  });
  const prepared = await rag.prepareRAGContext('What are your top database projects?');
  assert.equal(retrievalCalls.length, 1);
  assert.ok(prepared.chunks.every(item => item.metadata.itemId === project.id));
  const unavailableTopic = harness({ retrieval: async () => [] });
  const absent = await unavailableTopic.rag.prepareRAGContext('What are your top DevOps projects?');
  assert.equal(unavailableTopic.retrievalCalls.length, 2);
  assert.match(absent.fallback?.answer ?? '', /couldn't find supporting material/);
});

test('named employer questions keep current career scope without unrelated project hits', async () => {
  const { rag, portfolio, retrievalCalls } = harness({ retrieval: async () => [chunk] });
  const employer = await rag.prepareRAGContext("Is Shree's QuinStreet incident-analysis pipeline running in production?");
  assert.ok(employer.chunks.length > 0);
  assert.ok(employer.chunks.every(item => item.metadata.type === 'experience'));
  assert.ok(employer.chunks.every(item => portfolio.experiences.some(experience =>
    experience.id === item.metadata.itemId && experience.company === 'QuinStreet')));
  const internship = await rag.prepareRAGContext("What start date is recorded for Shree's QuinStreet internship?");
  assert.ok(internship.chunks.every(item => item.metadata.itemId === 'exp-quinstreet-intern'));
  const comparison = await rag.prepareRAGContext('Compare FaultLab with the work at QuinStreet');
  assert.ok(comparison.chunks.some(item => item.metadata.itemId === 'project-faultlab'));
  assert.ok(comparison.chunks.some(item => item.metadata.type === 'experience'));
  assert.equal(retrievalCalls.length, 0);
  const selected = await rag.prepareRAGContext('Compare FaultLab with the work at QuinStreet',
    { enabled: true, itemType: 'project', itemId: 'project-faultlab' });
  assert.ok(selected.chunks.every(item => item.metadata.itemId === 'project-faultlab'));
});

test('a semantic metric hit is supplemented only with its matched project evidence and deduplicated', async () => {
  const { projects } = await import('../src/data/portfolio');
  const project = projects.find(item => item.id === 'project-cordon');
  assert.ok(project);
  const source = chunkProject(project);
  const metric = source.find(item => item.id.endsWith('-metrics'));
  const details = source.find(item => item.id.endsWith('-details'));
  assert.ok(metric && details);
  const { rag, modelRequests } = harness({
    retrieval: async () => [
      { ...metric, similarity: 0.82 },
      { ...details, similarity: 0.71 },
      { ...details, similarity: 0.71 },
    ],
  });
  const prepared = await rag.prepareRAGContext('What measured containment results are recorded?');
  assert.ok(prepared.chunks.every(item => item.metadata.itemId === project.id));
  assert.equal(new Set(prepared.chunks.map(item => item.content)).size, prepared.chunks.length);
  await rag.getRAGResponse('What measured containment results are recorded?', undefined, prepared);
  const prompt = modelRequests[0].messages[1].content;
  assert.ok(prompt.includes(project.duration));
  assert.ok(prompt.includes(project.impact));
  assert.ok(prompt.includes(project.myRole));
  assert.ok(prompt.includes(project.links.github!));
});

test('contact and résumé questions use approved current links without guessing from the saved index', async () => {
  const { rag, portfolio, modelRequests, retrievalCalls } = harness({ retrieval: async () => [] });
  const query = 'Where can I book a conversation with Shree and read his resume?';
  const prepared = await rag.prepareRAGContext(query);
  assert.equal(prepared.chunks.length, 1);
  assert.equal(prepared.chunks[0].metadata.itemId, 'personal-info');
  const answer = await rag.getRAGResponse(query, undefined, prepared);
  const prompt = prepared.chunks[0].content;
  for (const link of [
    portfolio.personalInfo.links.email,
    portfolio.personalInfo.links.calendar,
    portfolio.personalInfo.links.resume.pdf,
    portfolio.personalInfo.links.resume.html,
  ]) {
    assert.ok(link && prompt.includes(link));
  }
  assert.equal(retrievalCalls.length, 0);
  assert.equal(modelRequests.length, 0, 'public URLs must not be invented by a model');
  assert.ok(answer.answer.includes(`](${portfolio.personalInfo.links.resume.pdf})`));
  assert.ok(answer.answer.includes(`](${portfolio.personalInfo.links.calendar})`));
  const streamed = await events(await request(harness({ retrieval: async () => [] }).route, true, undefined, query));
  assert.deepEqual(streamed.map(event => event.type), ['metadata', 'chunk', 'done']);
  assert.ok(streamed[1].content.includes(`](${portfolio.personalInfo.links.resume.pdf})`));
  assert.deepEqual(streamed[0].citations.map((citation: Citation) => citation.id), ['personal-info']);
  const combined = await rag.prepareRAGContext('Where can I book a conversation with Shree and what is his current role?');
  assert.equal(combined.fallback, undefined, 'additional work questions keep model context');
  assert.doesNotMatch(prompt, /jobsearch-|Visa Status and Work Authorization|earliest start date/i);

  await rag.prepareRAGContext('Where does execution resume after a tool timeout?');
  assert.equal(retrievalCalls.length, 2, 'resume as a technical verb must retain semantic retrieval and its fallback');
  await rag.prepareRAGContext('How does your email service handle retries?');
  assert.equal(retrievalCalls.length, 4, 'email engineering questions must retain semantic retrieval');
  const projectQuery = await rag.prepareRAGContext('Give me the FaultLab repository and your email');
  assert.ok(projectQuery.chunks.every(item => item.metadata.itemId === 'project-faultlab'));
});

test('benchmark answers retain recorded dataset scale in both modes when generation omits it', async () => {
  const query = "Was Shree's DuckDB project 1.56 times faster on every query?";
  const { route, portfolio } = harness({ modelAnswer: 'No. The overall TPC-H speedup was 1.56×, not a result on every query.' });
  const project = portfolio.projects.find(project => project.id === 'project-duckdb');
  assert.ok(project);
  const ordinary = await (await request(route, false, undefined, query)).json();
  assert.ok(ordinary.answer.includes(`Recorded benchmark scope: ${project.impact}`));
  const streamed = await events(await request(route, true, undefined, query));
  const answer = streamed.filter(event => event.type === 'chunk').map(event => event.content).join('');
  assert.equal(answer, ordinary.answer);
  assert.equal(streamed.at(-1)?.type, 'done');
  assert.deepEqual(streamed[0].citations, ordinary.citations);
  const complete = harness({ modelAnswer: 'The overall TPC-H speedup at 100 GB was 1.56×.' });
  const existing = await (await request(complete.route, false, undefined, query)).json();
  assert.doesNotMatch(existing.answer, /Recorded benchmark scope:/);
});

test('empty and whitespace-only nonstreaming model results return availability instead of success', async () => {
  for (const modelFailure of ['empty', 'whitespace'] as const) {
    const { route } = harness({ modelFailure });
    const response = await (await request(route, false)).json();
    assert.match(response.answer, /assistant is unavailable/);
    assert.equal(response.confidence, 0);
    assert.deepEqual(response.citations, []);
  }
  const { route } = harness({ modelFailure: 'whitespace' });
  const streamed = await events(await request(route));
  assert.ok(streamed.some(event => event.type === 'error'));
  assert.ok(!streamed.some(event => event.type === 'done'));
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

test('known selected pages use their current local content before semantic retrieval', async () => {
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
  assert.equal(retrievalCalls.length, 0, 'known pages need no saved-index query');
  for (let index = 0; index < modelRequests.length; index += 2) {
    assert.equal(modelRequests[index].messages[1].content, modelRequests[index + 1].messages[1].content);
  }
});

test('explicit new project names use current public content before unrelated saved-index hits', async () => {
  const stalePrivateChunk = { ...chunk, content: 'PRIVATE_INDEX_ONLY: superseded employer details' };
  const { rag, route, portfolio, retrievalCalls, modelRequests } = harness({
    retrieval: async () => [stalePrivateChunk],
  });
  for (const [query, id] of [
    ['Tell me about FaultLab', 'project-faultlab'],
    ['Tell me about CORDON', 'project-cordon'],
    ['How does the algorithmic-options-trading-system work?', 'project-trading'],
    ['How does your trading system handle uncertain orders?', 'project-trading'],
    ['Explain the DuckDB hash join optimization', 'project-duckdb'],
    ["Was Shree's DuckDB project faster on every query?", 'project-duckdb'],
    ['Tell me about Fault Lab', 'project-faultlab'],
  ]) {
    const project = portfolio.projects.find((item) => item.id === id);
    assert.ok(project, id);
    const prepared = await rag.prepareRAGContext(query);
    assert.equal(prepared.fallback, undefined);
    assert.ok(prepared.chunks.length > 0);
    assert.ok(prepared.chunks.every((item) => item.metadata.itemId === id));
    const response = await rag.getRAGResponse(query, undefined, prepared);
    assert.equal(response.citations.length, 1);
    assert.equal(response.citations[0].id, id);
    assert.equal(response.confidence, 0.5, 'name lookup is not a measured semantic score');
    const prompt = modelRequests.at(-1)!.messages[1].content;
    assert.ok(prompt.includes(project.approach), 'the model receives the current catalog approach');
    assert.doesNotMatch(prompt, /PRIVATE_INDEX_ONLY|engineering-record\/|Claude_Resume_Work\/corpus/);
  }
  const query = 'Tell me about FaultLab';
  const streamed = await events(await request(route, true, undefined, query));
  assert.equal(streamed[0].citations[0].id, 'project-faultlab');
  assert.deepEqual(streamed.map((event) => event.type), ['metadata', 'chunk', 'done']);
  const ordinary = await (await request(route, false, undefined, query)).json();
  assert.deepEqual(ordinary.citations, streamed[0].citations);
  assert.equal(modelRequests.at(-1)!.messages[1].content, modelRequests.at(-2)!.messages[1].content);
  assert.equal(retrievalCalls.length, 0, 'an older nonempty index cannot hide a named new project');
});

test('explicit project comparisons include each named current project once', async () => {
  const { rag, retrievalCalls } = harness();
  const prepared = await rag.prepareRAGContext('Compare FaultLab with CORDON and the trading project');
  const ids = [...new Set(prepared.chunks.map((item) => item.metadata.itemId))].sort();
  assert.deepEqual(ids, ['project-cordon', 'project-faultlab', 'project-trading']);
  assert.ok(prepared.chunks.every((item) => item.metadata.type === 'project'));
  assert.equal(retrievalCalls.length, 0);
});

test('a selected current page is not broadened by another explicitly named project', async () => {
  const { rag, portfolio, retrievalCalls } = harness();
  for (const context of [
    { enabled: true, itemType: 'project', itemId: 'project-faultlab' },
    { enabled: true, itemType: 'experience', itemId: portfolio.experiences[0].id },
  ] satisfies ChatContext[]) {
    const prepared = await rag.prepareRAGContext('Compare this with CORDON and the trading system', context);
    assert.ok(prepared.chunks.length > 0);
    assert.ok(prepared.chunks.every((item) => item.metadata.itemId === context.itemId));
    assert.ok(prepared.chunks.every((item) => item.metadata.type === context.itemType));
  }
  assert.equal(retrievalCalls.length, 0);
});

test('broad technology questions and project-name substrings do not guess a named project', async () => {
  const { rag, retrievalCalls } = harness();
  for (const query of ['What is DuckDB?', 'What is AI trading?', 'What is a FaultLaboratory?', 'How does code search work?']) {
    const prepared = await rag.prepareRAGContext(query);
    assert.equal(prepared.chunks[0].metadata.itemId, chunk.metadata.itemId);
  }
  assert.equal(retrievalCalls.length, 4);
});

test('named local projects retain missing-service and model-failure guards', async () => {
  for (const options of [{ configured: false }, { vectorAvailable: false }]) {
    const { rag, retrievalCalls, modelRequests } = harness(options);
    const response = await rag.getRAGResponse('Tell me about FaultLab');
    assert.match(response.answer, /assistant is unavailable/);
    assert.equal(response.citations.length, 0);
    assert.equal(retrievalCalls.length, 0);
    assert.equal(modelRequests.length, 0);
  }
  const { rag, retrievalCalls, modelRequests } = harness({ modelFailure: 'before' });
  const response = await rag.getRAGResponse('Tell me about CORDON');
  assert.match(response.answer, /assistant is unavailable/);
  assert.doesNotMatch(response.answer, /Private provider/);
  assert.equal(response.citations.length, 0);
  assert.equal(retrievalCalls.length, 0);
  assert.equal(modelRequests.length, 1);
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
