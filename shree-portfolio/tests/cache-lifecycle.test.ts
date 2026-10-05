import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

test('importing the real cache does not keep a completed CLI process alive', () => {
  const cacheUrl = pathToFileURL(resolve('src/lib/ai/cache.ts')).href;
  const program = `
    import assert from 'node:assert/strict';
    const imported = await import(${JSON.stringify(cacheUrl)});
    const cache = imported.default ?? imported;
    cache.setCachedEmbedding('lifecycle regression', [0.25, 0.75]);
    assert.deepEqual(cache.getCachedEmbedding('lifecycle regression'), [0.25, 0.75]);
    console.log('cache imported and usable');
  `;
  const result = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '--eval', program], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 5000,
  });

  assert.equal(result.error, undefined, `Subprocess must exit naturally: ${result.error?.message}`);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.signal, null);
  assert.match(result.stdout, /cache imported and usable/);
});
