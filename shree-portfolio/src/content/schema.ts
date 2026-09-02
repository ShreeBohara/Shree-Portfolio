import { z } from 'zod';

/**
 * Frontmatter schema for site content.
 *
 * The rules here are the ones the résumé corpus enforces on paper, made
 * executable: a number cannot appear on the site without saying how it is known
 * and where it came from, and an award cannot appear while its provenance is
 * unsettled. The build fails rather than shipping an unsourced claim.
 */

/**
 * Confidence tags, copied from corpus/facts.md — never chosen freshly. The
 * corpus assigns these; the site's job is to carry them through so a reader can
 * tell a measurement from an estimate.
 */
export const provenance = z.enum([
  'measured',   // observed directly: a count, a benchmark, a test run
  'estimated',  // derived with stated assumptions; renders as prose, never bold
  'derived',    // computed from other measured values
  'argued',     // true by construction rather than measurement
  'stated',     // claimed by Shree, not independently verified
  'research',   // an external figure; context only, never presented as his result
]);

export const metric = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  provenance,
  /**
   * Where the value comes from: a facts.md row ("facts.md: CORDON › Attack
   * success vs CORDON"), a repo path, or a URL. Required — this field is the
   * whole point of the schema.
   */
  source: z.string().min(3),
  note: z.string().optional(),
  /** Marks a number that reflects badly and is disclosed on purpose. */
  negative: z.boolean().default(false),
});

export const award = z.object({
  name: z.string(),
  placement: z.string(),
  fieldSize: z.string().optional(),
  date: z.string(),
  source: z.string(),
  /**
   * Set when an award's provenance is disputed. Blocked awards never render and
   * are never indexed: EchoLens is recorded as an LA Hacks win in the corpus,
   * while the only public record is a different event with no winner ribbon.
   */
  blocked: z.boolean().default(false),
});

/** How much page a project gets. One-liners are list rows with no page. */
export const tier = z.enum(['case-study', 'standard', 'one-liner']);

export const status = z.enum([
  'live',          // a URL a stranger can open
  'repo',          // public source, nothing deployed
  'private',       // no public artifact; the write-up is the artifact
  'retired',       // superseded, kept for the record
  'unprovisioned', // deployment configured but never run
  'ci-red',        // public but its CI is failing; say so rather than hide it
  'paper',         // a document, not a deployment
]);

export const workSchema = z.object({
  /** The MDX body. Declared explicitly rather than relying on the implicit field. */
  content: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  tier,
  status,
  /**
   * Exactly one number, so a row can show a fact instead of an adjective. The
   * check is deliberately crude: it catches summaries written as pure marketing
   * copy and summaries stuffed with figures.
   */
  summary: z.string().max(400),
  dates: z.object({
    start: z.string(),
    end: z.string(),
    /** Overrides the rendered range. The trading system must read "2023 – Present". */
    display: z.string().optional(),
  }),
  links: z
    .object({
      live: z.string().url().optional(),
      repo: z.string().url().optional(),
      video: z.string().url().optional(),
      paper: z.string().optional(),
      demo: z.string().url().optional(),
      writeup: z.string().url().optional(),
    })
    .default({}),
  /** Some repositories carry a person's or a company's name and must not be shown. */
  hideRepoName: z.boolean().default(false),
  stack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  metrics: z.array(metric).default([]),
  awards: z.array(award).default([]),
  /**
   * Required on every project page. The corpus rule is "own it, don't hide it":
   * most of these projects were built with coding agents, and the division of
   * labour is the answer to "how much of this did you write?".
   */
  builtWith: z.object({
    duration: z.string(),
    tools: z.array(z.string()).default([]),
    agentLanes: z.string().optional(),
    handWritten: z.string(),
    notBroken: z.string(),
    coAuthored: z.boolean().default(false),
  }),
  diagrams: z
    .array(z.object({ src: z.string(), alt: z.string(), caption: z.string(), redacted: z.boolean().default(false) }))
    .default([]),
  screenshots: z
    .array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }))
    .default([]),
  askSuggestions: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  order: z.number(),
  featured: z.boolean().default(false),
  /** Traceability back to the dossier the copy was written from. */
  sourceDossier: z.string().optional(),
  updated: z.string(),
});
