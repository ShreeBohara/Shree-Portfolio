# Portfolio chat accuracy audit — 4 October 2026

The published portfolio was tested with a frozen bank of 20 questions against
the approved public data. The baseline at `ada847a` had **10 pass, 6 partial and
4 fail** in an independent manual source review. All 20 HTTP requests completed.
Expected citation IDs appeared in 16 of 17 cases that required them; several
answers were still wrong. A retrieved-source label does not establish that an
answer is supported by that source.

## Corrections

- Serialize actual public project, career-entry, calendar and résumé links into context.
  Straightforward contact/résumé questions now return the stored public links
  directly, without asking the model to reconstruct a URL.
- Allow documented employment dates and project limitations while preserving
  refusals for personal compensation, weaknesses and future hiring availability.
  Regression cases include mixed public/private questions and possessive
  project wording.
- Keep benchmark scope, disabled execution, unaccepted repairs, attribution and
  optional model/provider paths beside the relevant results. Metric chunks now
  include the recorded impact and limitations, rather than isolated numbers.
- Clarify that Team Gatekeeper was the two-person FaultLab team; preserve
  collaborators, AI assistance and limits on individual component attribution.
- Correct false causal premises, distinguish design intent from proven effects,
  compare like measures, and distinguish private implementation code from a
  public engineering write-up.
- Use the current catalog for supported category/generic overviews. Unknown
  topic qualifiers retain semantic retrieval. Named projects and selected
  pages keep their existing source boundaries.
- Supplement semantic project hits only with the matched project's current
  public details, attribution and links. Reject blank model output safely.
- Named employer questions use current career entries, including explicit
  internship/full-time scope, rather than unrelated project search results.
  Explicit employer/project comparisons include both; selected pages retain
  their source boundary.
- Render citations without a destination as labels; catalog items remain
  actionable. A literal approved page path in a Markdown label links to that
  page even if the model attaches a different href. This corrects routing in
  the rendered answer, without claiming to validate arbitrary generated links.
  Placeholder destinations render as readable text rather than dead links.
  Generic link labels use the stored destination type, so a supplied product
  URL is labeled as a product page rather than a portfolio experience page.
  Preserve the original site layout.
- For an answer about a single project's benchmark, append its exact approved
  impact record when the model omits a documented dataset scale. The same
  correction works in both API modes, without a second model call. This is a
  narrow completeness guard; it does not validate arbitrary generated claims.

## Validation and evidence

`npm run check` passes: **74 tests**, TypeScript, public content lint, source-backed
fact verification, résumé verification and the production build. ESLint has
52 existing warnings and no errors. Offline tests exercise the real route and
RAG modules with explicit service substitutes, including both response modes,
privacy refusal before generation, rate-limit headers, cancellation, source
scope and blank responses.

Local provider retests were retained as separate iterations, including imperfect
answers that prompted further corrections. Browser review verified the stored
calendar/résumé destinations, non-actionable source labels, working project
dialogs and mobile layout. The fresh 20-question production follow-up at
`17b05cd` had **18 pass, 2 partial and no failures** under the unchanged rubric,
with no transport failures and all 17 required citation-ID cases covered.
The partial answers had a missing DuckDB benchmark size and misleading extra
links in DuckDB and employer-pipeline answers. Routing and employer source scope
received a final correction and separate targeted retests; these must not be
presented as another independent 20-question pass.

A same-bank local trial of `gpt-4.1-mini-2025-04-14` had **16 pass, 1 partial and
3 failures**, introducing unsupported migration, repair and routing claims.
It was not promoted. The current model was retained based on these samples,
rather than assuming that a model change would improve source fidelity.
The alternative is described by the [official model documentation](https://developers.openai.com/api/docs/models/gpt-4.1-mini);
the observed comparison is specific to this question bank and prompt.

Transcripts, independent reviews and deployment records are saved in:

`/Users/shree/Desktop/Portfolio/chat-audit-2026-10-04/`

The pre-change 106-row index backup is private, mode 0600, and kept outside Git.
Chunk IDs remain stable. Publication refreshes embeddings only after the matching
deployment is ready, then checks every stored ID, content field, metadata object
and finite 1536-dimensional vector.

## Method and limits

The bank covers biography, contact links, historical dates, employer scope,
project evidence and ownership, requested URLs, unknown skills, private recruiting
questions and a request to fabricate results. Ten requests stream and ten return
JSON. Requests are sequential, at least eight seconds apart, using one ordinary
client identity and respecting `Retry-After`.

Manual verdicts evaluate the requested facts, qualifications and actual URLs
against current public sources. Citation coverage is recorded separately from
claim support. The baseline did not log exact formatted model context, so a
missing answer detail alone cannot distinguish retrieval omission from model
omission. The frozen bank and iterative retests are useful regression evidence;
they do not measure general accuracy or guarantee every future generated answer.
The protocol follows task-specific examples and combines automated transport
checks with human judgment, as described in the [OpenAI evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices).
