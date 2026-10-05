# Shree Portfolio

The original chat and browse portfolio at [shreebohara.com](https://shreebohara.com), built with Next.js, React, TypeScript, Supabase and OpenAI.

The active code was restored to the deployed version `5683076` on 4 October 2026, with focused local bug fixes. The rejected Phase 2–5 redesign remains recoverable in Git. Production has not been changed by this restoration.

The current local information refresh keeps that UI and adds the reviewed public project catalog, profile, experience and résumé. See the [content update](docs/PUBLIC-CONTENT-UPDATE.md) for sources, verification and release status.

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
npm run check  # types, lint, tests, content rules, facts, résumé consistency, build
```

Fact verification uses the private résumé corpus at `~/Projects/Claude_Resume_Work/corpus`, or `CORPUS_PATH`. It reports a skip when that corpus is absent; a skip is not verification.

## Current behavior

- `/`: original chat interface, grounded answers and source chips.
- `/browse`: project grid, experience and education sections.
- `/about`: biography and contact links.
- `/archive`: original photo canvas and lightbox; photo API is read-only.
- `/projects/[slug]`, `/experience/[id]`: direct detail links.
- `/work/[slug]`: three sourced MDX case studies, linked from their catalog entries.
- `/resume.html`: a semantic HTML version of the public résumé; the PDF remains downloadable.

Edit profile, experience and education in `src/data/portfolio.ts`, and projects in `src/data/projects.ts` (re-exported from `portfolio.ts`). These public modules supply the original UI, detail routes, sitemap and chat chunks. MDX is additional case-study material linked through `links.caseStudy`, not an independent catalog source. Read [CLAUDE.md](CLAUDE.md) before changing personal facts; the résumé corpus is a reference and must not be edited here.

The public résumé is a curated projection of those same modules. `npm run resume:build` exports its JSON and builds the PDF/HTML using Python with ReportLab installed. Set up that Python environment before rebuilding; ordinary site builds do not require Python. `npm run verify:resume` fails if the source or either generated artifact no longer matches the public data. The PDF builder rejects pagination overflow instead of replacing the previous artifact.

Indexing is a deliberate maintenance operation in `scripts/index-content.ts`: it calls OpenAI and writes Supabase. Updating source files alone does not refresh the production search index.

Retrieval uses saved hits only for ranking and resolves their text against current approved chunks. Unknown, retired or mismatched hits are dropped. Selected pages and explicit project names use current local chunks. This prevents stale answers but does not refresh semantic ranking; rebuild the index as part of the approved release, after deploying the matching public content.

See the [project review](docs/PROJECT-REVIEW.md) for restoration evidence, test results, recovery paths and the next content work. Older technical guides are kept in [docs/legacy](docs/legacy/) and are not the current specification.

Pushing to `main` automatically deploys on Vercel. Obtain Shree's explicit approval before pushing or changing production.
