import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import type { ContentChunk } from '../src/lib/ai/chunking';

function evaluate<T>(file: string, dependencies: Record<string, unknown>, processState: object): T {
  const compiledModule = { exports: {} };
  const filename = resolve(file);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText;
  return runInNewContext(code, {
    module: compiledModule, exports: compiledModule.exports, process: processState,
    console: { log() {}, warn() {}, error() {} }, Error,
    require: (name: string) => {
      if (!(name in dependencies)) throw new Error(`Unmocked dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename }) as T;
}

const replacement: ContentChunk = {
  id: 'current', content: 'Updated public content',
  metadata: { type: 'project', itemId: 'project', title: 'Project' },
};

async function indexHarness(options: {
  failure?: 'generation' | 'write'; force?: boolean; empty?: boolean;
  generationResult?: 'partial' | 'bad-vector' | 'wrong-id';
  countFailure?: 'before' | 'after'; countMismatch?: boolean;
} = {}) {
  const calls: string[] = [];
  const rows = new Map([['current', 'Old public content'], ['obsolete', 'Retired content']]);
  const processState = { env: { FORCE_REINDEX: options.force === false ? undefined : 'true' }, exitCode: 0 };
  const vectorStore = {
    isVectorStoreAvailable: () => true,
    getEmbeddingCount: async () => {
      if (options.countFailure === (calls.length === 0 ? 'before' : 'after')) throw new Error('Count failed');
      return options.countMismatch && calls.length > 0 ? 99 : rows.size;
    },
    upsertEmbeddings: async (chunks: Array<ContentChunk & { embedding: number[] }>) => {
      calls.push('write');
      if (options.failure === 'write') throw new Error('Database unavailable');
      for (const chunk of chunks) rows.set(chunk.id, chunk.content);
    },
    pruneEmbeddings: async (retainedIds: string[]) => {
      calls.push('prune');
      for (const id of rows.keys()) if (!retainedIds.includes(id)) rows.delete(id);
    },
  };
  await evaluate<Promise<void>>('scripts/index-content.ts', {
    dotenv: { config() {} },
    '../src/lib/ai/chunking': { chunkAllContent: () => options.empty ? [] : [replacement] },
    '../src/lib/ai/embeddings': { generateChunkEmbeddings: async (chunks: ContentChunk[]) => {
      calls.push('generate');
      if (options.failure === 'generation') throw new Error('Provider unavailable');
      if (options.generationResult === 'partial') return [];
      return chunks.map((chunk) => ({
        ...chunk,
        id: options.generationResult === 'wrong-id' ? 'unexpected' : chunk.id,
        embedding: Array(1536).fill(options.generationResult === 'bad-vector' ? Infinity : 0.1),
      }));
    } },
    '../src/lib/ai/vector-store': vectorStore,
    '../src/data/portfolio': { projects: [], experiences: [], education: [], personalInfo: {} },
    '../src/lib/ai/config': { AI_CONFIG: { embedding: { dimensions: 1536 } } },
  }, processState);
  return { calls, rows, processState };
}

test('failed embedding generation leaves every existing index row untouched', async () => {
  const { calls, rows, processState } = await indexHarness({ failure: 'generation' });
  assert.deepEqual(calls, ['generate']);
  assert.equal(rows.get('current'), 'Old public content');
  assert.equal(rows.has('obsolete'), true);
  assert.equal(processState.exitCode, 1);
});

test('failed replacement writes never prune working index rows', async () => {
  const { calls, rows, processState } = await indexHarness({ failure: 'write' });
  assert.deepEqual(calls, ['generate', 'write']);
  assert.equal(rows.size, 2);
  assert.equal(processState.exitCode, 1);
});

test('successful generation and writes precede removal of obsolete IDs', async () => {
  const { calls, rows, processState } = await indexHarness();
  assert.deepEqual(calls, ['generate', 'write', 'prune']);
  assert.equal(rows.get('current'), 'Updated public content');
  assert.equal(rows.has('obsolete'), false);
  assert.equal(processState.exitCode, 0);
});

test('FORCE_REINDEX is still required and empty content cannot replace a working index', async () => {
  for (const options of [{ force: false }, { empty: true }]) {
    const { calls, rows } = await indexHarness(options);
    assert.deepEqual(calls, []);
    assert.equal(rows.size, 2);
  }
});

test('partial, mismatched and invalid replacement embeddings are rejected before writes or pruning', async () => {
  for (const generationResult of ['partial', 'bad-vector', 'wrong-id'] as const) {
    const { calls, rows, processState } = await indexHarness({ generationResult });
    assert.deepEqual(calls, ['generate']);
    assert.equal(rows.get('current'), 'Old public content');
    assert.equal(rows.has('obsolete'), true);
    assert.equal(processState.exitCode, 1);
  }
});

test('count failures cannot bypass the initial guard or report final success', async () => {
  const before = await indexHarness({ countFailure: 'before', force: false });
  assert.deepEqual(before.calls, []);
  assert.equal(before.rows.size, 2);
  assert.equal(before.processState.exitCode, 1);
  for (const options of [{ countFailure: 'after' as const }, { countMismatch: true }]) {
    const result = await indexHarness(options);
    assert.deepEqual(result.calls, ['generate', 'write', 'prune']);
    assert.equal(result.processState.exitCode, 1);
  }
});

function loadVectorStore(fakeClient: object): typeof import('../src/lib/ai/vector-store') {
  const source = readFileSync(resolve('src/lib/ai/vector-store.ts'), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  runInNewContext(code, {
    module: compiledModule, exports: compiledModule.exports, Error,
    console: { error() {} },
    process: { env: { SUPABASE_URL: 'https://test.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-key' } },
    require: (name: string) => {
      assert.equal(name, '@supabase/supabase-js');
      return { createClient: () => fakeClient };
    },
  });
  return compiledModule.exports as typeof import('../src/lib/ai/vector-store');
}

test('the actual vector-store count function throws on database failure instead of treating the index as empty', async () => {
  const store = loadVectorStore({ from: () => ({
    select: async () => ({ count: null, error: { message: 'Database unavailable' } }),
  }) });
  await assert.rejects(store.getEmbeddingCount(), /Failed to count embeddings/);
});

test('pruning pages before deletion and deletes only obsolete IDs in bounded requests', async () => {
  const ids = Array.from({ length: 1105 }, (_, index) => `id-${String(index).padStart(4, '0')}`);
  const retained = ids.filter((_id, index) => index % 2 === 0);
  const rows = new Set(ids);
  const readOffsets: number[] = [];
  const deletedBatches: string[][] = [];
  const fakeClient = {
    from: () => ({
      select: () => ({ order: () => ({ range: async (start: number, end: number) => {
        assert.equal(deletedBatches.length, 0, 'pagination must finish before deletion shifts rows');
        readOffsets.push(start);
        return { data: [...rows].sort().slice(start, end + 1).map((id) => ({ id })), error: null };
      } }) }),
      delete: () => ({ in: async (_column: string, obsolete: string[]) => {
        assert.ok(obsolete.length <= 200);
        deletedBatches.push([...obsolete]);
        obsolete.forEach((id) => rows.delete(id));
        return { error: null };
      } }),
    }),
  };
  const storeExports = loadVectorStore(fakeClient);
  await storeExports.pruneEmbeddings(retained);
  assert.deepEqual(readOffsets, [0, 1000]);
  assert.deepEqual([...rows].sort(), retained);
  assert.equal(deletedBatches.flat().length, ids.length - retained.length);
  await assert.rejects(storeExports.pruneEmbeddings([]), /without replacement IDs/);
});
