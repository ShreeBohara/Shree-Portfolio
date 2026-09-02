# Working on this repository

The site is shreebohara.com. It is linked from Shree's résumé, so its claims are
read next to a document that has been through a verification pipeline.

## The one rule

**Every fact about Shree resolves to the résumé corpus**
(`~/Projects/Claude_Resume_Work/corpus`). That corpus is owned by another
project: read it, never write to it. If something is wrong there, report it
rather than fixing it here.

Two linters enforce this and both run in `npm run check`:

- `npm run lint:content` — fails on strings the corpus forbids
  (`content/forbidden.json`): retired figures, stale status, employer detail the
  import policy bars.
- `npm run verify:facts` — reconciles every metric's value and confidence tag
  against its `facts.md` row.

## Things that are settled, so please do not reintroduce them

- The site does not say "graduate student", "seeking", or a start date. Shree is
  a Software Engineer at QuinStreet, San Francisco, since June 2026.
- The trading system is a **project** titled "Algorithmic Options Trading
  System", dated "2023 – Present". Never an employer, never a company name,
  never "trades live", never a P&L figure.
- QuinStreet content is method and magnitudes: no Year One KPIs, no revenue, no
  incident dwell times, no vendor names, no present-tense weaknesses.
- AI-assisted builds are disclosed on every project page (`builtWith`).
- Nothing above the fold is hydration-gated: the hero is server-rendered text.

## Working style

Small, reviewable commits. `npm run check` before pushing. Pushing to `main`
deploys to production, so ask first.
