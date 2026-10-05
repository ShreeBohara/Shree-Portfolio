# Public information update — 4 October 2026

This update retains the restored original chat/browse/about/archive design. It
uses the user-selected `/Users/shree/Projects/` source folder, while separating
current factual records from private employer evidence and historical outputs.

## What changed

- The catalog has 15 entries, with six current featured projects: FaultLab,
  Algorithmic Options Trading System, CORDON, CodebaseQA, Earshot and DuckDB.
  Delta Sentinel/GenomeCanvas and older work remain dated secondary material.
- Public profile and experience describe current roles and actual contributions;
  employer KPIs, sensitive incident details, uncertain personal anecdotes,
  unsupported technologies and unconfirmed publication claims are omitted.
- QuinStreet internship/full-time dates and USC completion agree across pages,
  chat chunks and résumé. HackMIT-WPU, Pune appears as a separate personal
  hackathon fact, not a USC award.
- CORDON retains the handcrafted-test denominator and false positive. GenomeCanvas
  distinguishes real/fallback structures, local retrieval/optional model calls,
  visual adjacency/biological function and configured/provisioned deployment.
- The public résumé is generated from a curated projection of the approved site
  modules. It has a semantic HTML alternative, source-drift checks and a PDF
  pagination guard. Application résumé presets were not copied wholesale.
- Chat hits are hydrated from current approved chunks rather than trusting old
  saved index text. Retired/mismatched records are discarded. Selected pages and
  explicit project names use current local material before semantic retrieval.
- Prompt suggestions now match supported public information. Featured cards link
  to their own detail pages. Profile metadata reads the public copy, and sitemap
  timestamps use the review date rather than claiming a new edit on every request.
- At the user's later request, FaultLab has generated conceptual artwork on its
  original catalog card and its direct detail page, with descriptive alternative
  text and a conceptual-art caption. Other project-page layouts are retained.
  The [artwork record](../shree-portfolio/docs/faultlab-artwork.md) preserves the
  generation prompt. The shipping WebP is approximately 60 KB; its original PNG
  is preserved outside the repository.

## Sources and limits

The detailed [project source map](../shree-portfolio/docs/project-source-map.md)
records each entry's dossiers, status and claim boundaries. Profile, education,
skills and employer copy use the corresponding current corpus records and the
QuinStreet import/publication policy. Latest `/Projects/Portfolio/` wording and
the public `refuses-to-trade` write-up support the selected project framing.

Facts that remain unconfirmed are omitted or qualified: bachelor institution
conflict, research publication venue, some older headline benchmarks, project
ownership beyond recorded contributions and private employer performance data.
Recorded test results are dated project evidence, not fresh execution of those
projects. HTTP link availability does not establish working remote applications.

FaultLab retains zero accepted generated policies in its recorded September 30
continuation. Trading's zero broker submissions occurred with execution disabled.
CORDON's synthetic fixture is not production coverage. Earshot's small manually
observed sessions are not a benchmark. DuckDB's overall result is separate from
the strongest selective query. These qualifiers remain in the catalog/chat data.

## Research applied

The installed Next.js 16.3.4 guides and [official metadata guidance](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
informed shared profile metadata and server-generated detail metadata. The
[sitemap API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
supports explicit last-modified dates, so the content review date is recorded
instead of regenerating an artificial timestamp.

The [W3C PDF reading-order guidance](https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF3)
motivated a single-column reading order and a semantic HTML reading alternative.
The PDF has searchable text and link annotations; full tagged-PDF/screen-reader
conformance is not claimed. Its exact exported page is rendered and inspected.

[Supabase's semantic-search guidance](https://supabase.com/docs/guides/ai/semantic-search)
describes stored document embeddings and query similarity. Source inspection
showed stale text could remain in those stored rows. The implementation now uses
the saved ranking signal with current local text; it does not pretend that this
refreshes the embeddings themselves.

## Verification

The final local `npm run check` passed: TypeScript, ESLint (53 existing warnings,
no errors), 55 offline tests, publication/content lint, 13 declared corpus-cited
MDX metric checks, résumé consistency and the production build (34 generated
outputs). The exact final PDF was checked with text extraction, rendering and
source consistency. Normal builds now enforce résumé consistency in `prebuild`
using Node, without requiring Python. Software checks used no live portfolio-chat
or embedding-provider requests; artwork was generated separately with the
built-in image tool.

All 18 reviewed outgoing repository/write-up/video URLs returned HTTP 200 for
unauthenticated bounded requests. Three case-study paths and eight image paths
resolve locally. This checks availability only; it does not test video playback,
paper contents behind the Drive preview or remote application functionality.

The public PDF has one Letter page, 386 extracted words and eight link
annotations. Its 9.5 pt body text was visually inspected for clipping, overlap
and missing glyphs. The source JSON, HTML and PDF share a content fingerprint,
and `verify:resume` rejects drift when selected public content changes.

The production preview at `http://127.0.0.1:3006` returned HTTP 200 for all 29
public build routes plus 11 résumé, project-image and OG-image requests. The OG
response is a PNG, the résumé is a PDF, current profile/project qualifiers are
present, and the sitemap records October 4 as its content date.

Manual browser checks covered desktop (1280 × 720) and a mobile viewport
override (390 × 844; effective CSS viewport approximately 354 × 767 in the app).
Home, About, Browse and the HTML résumé had no horizontal overflow or broken
rendered images. The catalog contains all 15 project cards; FaultLab's dialog
retains the zero-accepted-policy qualifier. Escape closes the dialog and restores
focus to its card; the mobile close control also works. The case-study link
opens the matching public page. No browser console errors were recorded.

Browser checks also corrected the location link to About, added an accessible
name to the mobile Projects link, and moved the disabled-execution qualifier to
the start of the trading summary so it survives the original card truncation.
Screenshots, route responses and PDF inspection records are saved under the
task's local visualization directory. Live generated chat output and the saved
embedding index were not tested or refreshed.

The later artwork addition also passed the 55-test suite, scoped ESLint,
TypeScript and a fresh production build. The WebP, catalog and FaultLab detail
route returned HTTP 200. An older image-bearing project retained its existing
detail-page layout. The generated image rendered at desktop and mobile widths
without overflow; its alternative text and visible caption identify conceptual
artwork, and no browser console errors were recorded.

## Maintenance and release

Edit profile/experience/education in `src/data/portfolio.ts`, projects in
`src/data/projects.ts`, and the reviewed content date in `src/data/site.ts`.
Regenerate the public résumé with `npm run resume:build` using a Python
environment with ReportLab. Site builds do not require Python; verification
uses Node and the committed artifacts. Keep the selected PDF content concise
rather than shrinking type to force pagination.

The rejected redesign, recovery materials, source corpus and historical
application packets remain preserved. Existing uncommitted content work was
reviewed and retained in this refresh. A checkpoint is outside the source folder
at `/Users/shree/Desktop/Portfolio/.content-update-checkpoint-2026-10-04/`.

The local branch is `codex/public-content-refresh`. Production and its shared
vector index have not been changed. Repository instructions require approval
before pushing to `main`, which deploys on Vercel. When publishing, deploy the
matching content/code first, then explicitly rebuild the saved embedding index;
doing the index first could expose new citations to the older production UI.
