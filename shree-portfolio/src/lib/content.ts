import { allWorks, type Work } from 'content-collections';

/**
 * Typed accessors over the compiled content collections.
 *
 * These accessors serve /work pages and their reviewed sitemap entries. The
 * classic Browse, /projects routes and assistant chunker use src/data/portfolio.ts.
 * A catalog entry links to its MDX case study through links.caseStudy; adding
 * MDX alone does not add a project to those other surfaces.
 */

export type { Work };

/** Everything with a page of its own. One-liners are rows in a list, not pages. */
export function workWithPages(): Work[] {
  return allWorks
    .filter((work) => work.tier !== 'one-liner')
    .sort((a, b) => a.order - b.order);
}

export function workBySlug(slug: string): Work | undefined {
  return allWorks.find((work) => work.slug === slug);
}

export function featuredWork(): Work[] {
  return allWorks.filter((work) => work.featured).sort((a, b) => a.order - b.order);
}

/** Awards whose provenance is settled. Blocked ones never reach a page. */
export function publishableAwards(work: Work) {
  return work.awards.filter((award) => !award.blocked);
}
