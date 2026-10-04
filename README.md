# Shree Portfolio

The original chat and browse portfolio at [shreebohara.com](https://shreebohara.com), built with Next.js, React, TypeScript, Supabase and OpenAI.

The active code was restored to the deployed version `5683076` on 4 October 2026, with focused local bug fixes. The rejected Phase 2–5 redesign remains recoverable in Git. Production has not been changed by this restoration.

## Run locally

The desktop `Portfolio/Shree-Portfolio` folder links to the active repository at `/Users/shree/Projects/shree-portfolio`, keeping Git and build files outside iCloud.

```sh
cd /Users/shree/Projects/shree-portfolio/shree-portfolio
npm ci
npm run dev
```

Use the Node version in `.nvmrc`. Existing `.env.local` credentials were preserved. For a fresh checkout, copy `.env.example` to `.env.local` and fill in OpenAI and Supabase credentials. Static portfolio pages work without credentials; the assistant reports when it cannot look up an answer. Optional Upstash credentials enable shared quotas across server instances; without them, the limiter is per instance.

```sh
npm test       # mocked regression checks, no service writes or API spend
npm run check  # types, lint, tests, content rules, facts, production build
```

Fact verification uses the private résumé corpus at `~/Projects/Claude_Resume_Work/corpus`, or `CORPUS_PATH`. It reports a skip when that corpus is absent; a skip is not verification.

## Current behavior

- `/`: original chat interface, grounded answers and source chips.
- `/browse`: project grid, experience and education sections.
- `/about`: biography and contact links.
- `/archive`: original photo canvas and lightbox; photo API is read-only.
- `/projects/[slug]`, `/experience/[id]`: direct detail links.
- `/work/[slug]`: the two validated MDX case studies already included in the deployed baseline.

Edit original catalog information in `src/data/portfolio.ts`. The separate `content/` MDX layer is not yet connected to that catalog. Read [CLAUDE.md](CLAUDE.md) before changing personal facts; the résumé corpus is a reference and must not be edited here.

Indexing is a deliberate maintenance operation in `scripts/index-content.ts`: it calls OpenAI and writes Supabase. Updating source files alone does not refresh the production search index.

See the [project review](docs/PROJECT-REVIEW.md) for restoration evidence, test results, recovery paths and the next content work. Older technical guides are kept in [docs/legacy](docs/legacy/) and are not the current specification.

Pushing to `main` automatically deploys on Vercel. Obtain Shree's explicit approval before pushing or changing production.
