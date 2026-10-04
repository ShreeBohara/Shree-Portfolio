# Project notes

Start with the root [README](../README.md) for setup and the [project review](PROJECT-REVIEW.md) for the restoration, verification, and remaining work.

The guides in [legacy](legacy/) are historical reference. They describe earlier versions and include removed features, old API instructions, and a placeholder AI implementation. Use the current source when they disagree. They are preserved with their screenshots and videos for recovery, not as the current specification.

Current implementation:

- `shree-portfolio/src/app`: original chat, browse, about, archive, project and experience routes; two MDX work pages.
- `shree-portfolio/src/data/portfolio.ts`: content used by the original UI and chat indexing.
- `shree-portfolio/content`: separately validated MDX case studies; this layer is not yet the original catalog's content source.
- `shree-portfolio/src/lib/ai`: grounded retrieval, deterministic privacy refusals, NDJSON generation and client parsing, rate limiting.
- `shree-portfolio/src/components/archive`: photo loading, canvas and lightbox; `/api/archive` is read-only.
- `shree-portfolio/tests`: network-free regression checks for failures, source consistency, quota reporting, and saved photo adjustments.

The résumé corpus is read-only to this project. Public content must follow `CLAUDE.md`; updating content and publishing changes are separate decisions.
