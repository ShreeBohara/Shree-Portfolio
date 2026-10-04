import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeArchivePhoto } from '../src/lib/archive/photos';
import * as archiveRoute from '../src/app/api/archive/route';

test('preserves saved photo adjustments, including zero vignette', () => {
  assert.deepEqual(normalizeArchivePhoto({
    id: 'photo', src: '/photo.jpg',
    filter_brightness: 120, filter_contrast: 80, filter_saturation: 0, filter_vignette: 0,
    crop_x: 0, crop_y: 10, crop_width: 80, crop_height: 60,
  }), {
    id: 'photo', src: '/photo.jpg',
    filters: { brightness: 120, contrast: 80, saturation: 0, vignette: 0 },
    crop: { x: 0, y: 10, width: 80, height: 60 },
  });
});

test('does not construct invalid crops or filters from absent columns', () => {
  assert.deepEqual(normalizeArchivePhoto({ id: 'photo' }), { id: 'photo' });
  assert.deepEqual(normalizeArchivePhoto({ id: 'photo', crop_x: 0, crop_y: 0, crop_width: 0, crop_height: 10 }), { id: 'photo' });
  assert.deepEqual(normalizeArchivePhoto({ id: 'photo', filter_brightness: null, filter_contrast: null }), { id: 'photo' });
});

test('archive fails gracefully without credentials and exposes no writes', async () => {
  const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;
  const previous = keys.map(key => process.env[key]);
  try {
    for (const key of keys) delete process.env[key];
    const response = await archiveRoute.GET();
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'Photo archive unavailable' });
    assert.equal('POST' in archiveRoute, false);
    assert.equal('DELETE' in archiveRoute, false);
  } finally {
    keys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key];
      else process.env[key] = previous[index];
    });
  }
});
