# Content

This directory holds typed MDX for the provisional `/work/<slug>` case-study
pages. The classic Browse view, `/projects/<slug>` pages, sitemap, OG metadata
and assistant chunker read the public modules re-exported by `src/data/portfolio.ts`.
The project catalog lives in `src/data/projects.ts`. A classic project's
`links.caseStudy` bridges to its MDX page; MDX alone does not reach the catalog or
assistant. The `/work` pages remain noindex while this content layer is developed.

Updating source makes new chunks available locally. Updating the saved vector
index is a separate explicit operation; it is not performed by this content pilot.

## Checks and their boundaries

1. **Every number carries a receipt.** A metric needs a `provenance` tag and a
   `source`. The tag is *copied* from `corpus/facts.md`, never chosen.
2. **Declare numeric evidence.** Use `<Fact id="..." />` for MDX body figures.
   Compilation checks that each Fact resolves to a declared metric. It does not
   detect every numeric claim in ordinary prose.
3. **Forbidden strings fail the build** (`content/forbidden.json`) — retired
   figures, stale status, employer detail the import policy bars.
4. **Metric values must match the corpus** (`npm run verify:facts`) — corpus-cited
   MDX metric numbers and confidence tags are reconciled against `facts.md`.
   These metric checks do not audit the classic catalog, PDFs, all prose
   qualifiers or causal claims; review those against their source records
   separately. Content lint also checks the classic public catalog for the
   declared forbidden strings.
5. **Disputed awards never render.** Set `blocked: true` and they stay off the
   MDX page until the provenance is settled.

## Omitted or restricted information

The October 4 refresh uses the current source records and omits unsupported or
restricted claims. These are content boundaries, not a pending questionnaire.
DeepTek's location now follows the current dossier's Mumbai entry; the old
portfolio's Pune text is retired.

| Item | Source limitation | Public treatment |
|---|---|---|
| Bachelor's institution | Current dossier and older site conflict | Institution omitted |
| GPA | No support in the designated corpus | Omitted |
| EchoLens award | Event and award records conflict | Award omitted; prototype retained |
| NIT-B runner-up | No corpus record | Omitted |
| Employer KPIs and security evidence | Restricted by the employer import/publication policy | Describe approved engineering methods without private figures or incident details |
| Earshot hosted demo | The recorded MVP does not establish a bounded hosted demo | Repository link only |
| Trading repository and screenshots | Source is private; no reviewed screenshots supplied | Public engineering write-up only |

## Adding a project

1. Add an approved classic entry in `src/data/projects.ts` for Browse, project
   details and assistant chunks. Link `links.caseStudy` to `/work/<slug>`.
2. Create `content/work/<slug>.mdx` with full frontmatter (see `faultlab.mdx`).
3. Put numeric evidence in `metrics`, sourced to a `facts.md` row, and reference
   it in the body as `<Fact id="..." />`. Preserve dates, scope and limitations.
4. Fill `builtWith` and the classic `myRole` honestly, including team and agent
   contributions. Keep employer-private evidence outside public content.
5. Compile content and run the applicable offline tests, content lint and fact
   checks. Run `npm run check` before a separately approved push/deployment.
