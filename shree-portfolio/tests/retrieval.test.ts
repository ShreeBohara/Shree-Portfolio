import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import * as portfolio from '../src/data/portfolio';
import * as chunking from '../src/lib/ai/chunking';
import type { EmbeddingRecord } from '../src/lib/ai/vector-store';

type IndexedHit = EmbeddingRecord & { similarity: number };
type Retrieval = typeof import('../src/lib/ai/retrieval');
const currentChunks = chunking.chunkAllContent(
  portfolio.projects, portfolio.experiences, portfolio.education, portfolio.personalInfo
);

function loadRetrieval(hits: IndexedHit[]) {
  const filename = resolve('src/lib/ai/retrieval.ts');
  const loaded = { exports: {} };
  const calls: { embedding: string[]; search: unknown[] } = { embedding: [], search: [] };
  const dependencies: Record<string, unknown> = {
    './embeddings': { generateEmbedding: async (query: string) => {
      calls.embedding.push(query);
      return [0.1, 0.2];
    } },
    './vector-store': { searchSimilar: async (_embedding: number[], options: unknown) => {
      calls.search.push(options);
      return hits;
    } },
    './config': { AI_CONFIG: { retrieval: { topK: 6, minScore: 0.5 } } },
    '@/data/portfolio': portfolio,
    './chunking': chunking,
  };
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText;
  runInNewContext(code, {
    module: loaded, exports: loaded.exports,
    require: (name: string) => {
      assert.ok(name in dependencies, `Unmocked dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename });
  return { retrieval: loaded.exports as Retrieval, calls };
}

function staleHit(chunk: chunking.ContentChunk): IndexedHit {
  return {
    id: chunk.id,
    content: 'Superseded biography with private hiring details and a retired result.',
    metadata: { ...chunk.metadata, title: 'Old title', year: 2024, tags: ['obsolete'] },
    embedding: [], similarity: 0.82,
  };
}

test('saved hits supply ranking only; answers and citations use current public text and metadata', async () => {
  const chunk = currentChunks.find(item => item.metadata.type === 'project');
  assert.ok(chunk);
  const hit = staleHit(chunk);
  const { retrieval, calls } = loadRetrieval([hit]);
  const results = await retrieval.retrieveRelevantContent('What did this project do?');
  assert.equal(results.length, 1);
  assert.equal(results[0].content, chunk.content);
  assert.deepEqual(results[0].metadata, chunk.metadata);
  assert.equal(results[0].similarity, hit.similarity, 'old embedding score is not presented as refreshed relevance');
  assert.doesNotMatch(retrieval.formatChunksForContext(results), /private hiring|retired result|Old title|obsolete/);
  const citations = retrieval.extractCitations(results);
  assert.equal(citations[0].id, chunk.metadata.itemId);
  assert.equal(citations[0].title, chunk.metadata.title);
  assert.equal(calls.embedding.length, 1);
  assert.equal(calls.search.length, 1);
});

test('retired rows, missing identities, mismatched metadata and duplicate saved hits cannot enter context', async () => {
  const chunk = currentChunks.find(item => item.metadata.type === 'project');
  assert.ok(chunk);
  const hit = staleHit(chunk);
  const { retrieval } = loadRetrieval([
    { ...hit, id: 'retired-private-chunk' },
    { ...hit, metadata: { ...hit.metadata, itemId: 'deleted-project' } },
    { ...hit, metadata: { ...hit.metadata, type: 'faq' } },
    { ...hit, metadata: undefined as unknown as IndexedHit['metadata'] },
    hit, hit,
  ]);
  const results = await retrieval.retrieveRelevantContent('Tell me about old content');
  assert.equal(results.length, 1);
  assert.equal(results[0].content, chunk.content);
  assert.equal(retrieval.extractCitations(results).length, 1);
});

test('current metadata also enforces selected scope without broadening into other catalog items', async () => {
  const projects = currentChunks.filter(item => item.metadata.type === 'project');
  const selected = projects[0];
  const other = projects.find(item => item.metadata.itemId !== selected.metadata.itemId);
  assert.ok(other);
  const { retrieval } = loadRetrieval([staleHit(other), staleHit(selected)]);
  const results = await retrieval.retrieveRelevantContent('Explain it', {
    filter: { type: 'project', itemId: selected.metadata.itemId },
    boostItemId: selected.metadata.itemId,
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].metadata.itemId, selected.metadata.itemId);
  assert.equal(results[0].content, selected.content);
  assert.equal(results[0].similarity, 0.82 + 0.1);
});

test('an entirely retired saved index yields no supporting material rather than stale answers', async () => {
  const chunk = currentChunks[0];
  const { retrieval } = loadRetrieval([{ ...staleHit(chunk), id: 'removed-old-biography' }]);
  const results = await retrieval.retrieveRelevantContent('Who is Shree?');
  assert.equal(results.length, 0);
  assert.equal(retrieval.formatChunksForContext(results), '');
  assert.equal(retrieval.extractCitations(results).length, 0);
});
