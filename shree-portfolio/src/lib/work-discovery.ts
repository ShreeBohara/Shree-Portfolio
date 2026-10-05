import type { Work } from '@/lib/content';

// Only these case studies have completed the source and publication review.
// New MDX pages stay out of search until they receive the same review.
const reviewedSlugs = new Set([
  'faultlab',
  'cordon',
  'algorithmic-options-trading-system',
]);

export function isIndexableWork(work: Pick<Work, 'slug' | 'tier'>): boolean {
  return work.tier === 'case-study' && reviewedSlugs.has(work.slug);
}
