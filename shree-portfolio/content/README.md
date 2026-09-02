# Content

Every page's copy lives here as MDX with typed frontmatter. Pages, the sitemap,
the OG images and the assistant's index all read from this directory, so a
project cannot appear on one surface and be missing from another.

## Rules the build enforces

1. **Every number carries a receipt.** A metric needs a `provenance` tag and a
   `source`. The tag is *copied* from `corpus/facts.md`, never chosen.
2. **Prose cannot smuggle numbers.** Figures render as `<Fact id="..." />`,
   which must resolve to a declared metric or the build fails.
3. **Forbidden strings fail the build** (`content/forbidden.json`) — retired
   figures, stale status, employer detail the import policy bars.
4. **Values must match the corpus** (`npm run verify:facts`) — value and
   confidence tag are reconciled against `facts.md` row by row.
5. **Disputed awards never render.** Set `blocked: true` and they stay off the
   page and out of the index until the provenance is settled.

## Unresolved — needs Shree

These block specific lines. Until each is answered the copy stays out rather
than going up wrong.

| Item | Question | Blocks |
|---|---|---|
| Bachelor's institution | Corpus says Pune University; the old site said MIT World Peace University. Which renders? | Education row on About |
| GPA | No corpus support for either GPA. Publish none? | Education row |
| DeepTek city | Corpus says Mumbai; the site said Pune and deeptek.ai says Pune | DeepTek entry |
| EchoLens award | Corpus records an LA Hacks win; the only public record is SoCal Tech Week 2024 with no winner ribbon | EchoLens award line (`blocked: true` until resolved) |
| NIT-B runner-up | No corpus record | Dropped unless evidence appears |
| QuinStreet KPIs | Year One brief figures need manager sign-off before publication | Experience threads use magnitudes meanwhile |
| QS-19 authorisation work | May the employer be named on a public security write-up? | Security thread |
| Earshot demo link | The demo mints Realtime tokens on Shree's key with no auth | Live link stays off until capped |
| Trading system screenshots | Only Shree can capture and redact them | Trading case study |

## Adding a project

1. Create `content/work/<slug>.mdx` with full frontmatter (see `cordon.mdx`).
2. Put every number in `metrics`, sourced to a `facts.md` row.
3. Reference them in the body as `<Fact id="..." />`.
4. Fill `builtWith` honestly — including what an agent wrote.
5. Run `npm run check`.
