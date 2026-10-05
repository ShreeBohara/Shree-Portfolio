# Project notes

Start with the root [README](../README.md) for setup and the [project review](PROJECT-REVIEW.md) for the restoration, verification, and remaining work.

The [public content update](PUBLIC-CONTENT-UPDATE.md) covers the later information refresh and its current verification. The restoration review remains historical evidence for that earlier change.

The guides in [legacy](legacy/) are historical reference. They describe earlier versions and include removed features, old API instructions, and a placeholder AI implementation. Use the current source when they disagree. They are preserved with their screenshots and videos for recovery, not as the current specification.

Current implementation:

- `shree-portfolio/src/app`: original chat, browse, about, archive, project and experience routes; three MDX work pages.
- `shree-portfolio/src/data/portfolio.ts`: profile, experience and education; re-exports the project catalog in `src/data/projects.ts`.
- `shree-portfolio/content`: separately validated MDX case studies linked by catalog entries.
- `shree-portfolio/scripts/export-public-resume.ts` and `build-public-resume.py`: curated public résumé projection, PDF and semantic HTML generation.
- `shree-portfolio/src/lib/ai`: grounded retrieval, deterministic privacy refusals, NDJSON generation and client parsing, rate limiting.
- `shree-portfolio/src/components/archive`: photo loading, canvas and lightbox; `/api/archive` is read-only.
- `shree-portfolio/tests`: network-free regression checks for failures, public source and retrieval consistency, quotas, content rules and saved photo adjustments.

The résumé corpus is read-only to this project. Public content must follow `CLAUDE.md`; updating content and publishing changes are separate decisions.
