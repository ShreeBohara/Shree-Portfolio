# Project cover artwork

Updated October 4, 2026 using the built-in image generation tool, at the user's request. All 15 catalog projects have images. Seven generated conceptual illustrations now include a large project name and a concise descriptor; the eight preexisting project images are unchanged.

## Design reasoning and references

The initial text-free renders were attractive but their purpose was hard to identify at a glance. The revised covers pair recognizable project concepts with clear typography and a shared graphite, teal, violet and amber palette. Amber represents uncertainty, containment or a paused path; it never claims a verified success.

- [Vercel's engineering cover](https://vercel.com/blog/category/engineering) provides a large-headline, quiet-geometric example. [Vercel's headline-preview guidance](https://vercel.com/guides/displaying-article-headlines-in-social-previews) also demonstrates titles inside a cover.
- [Raycast's blog](https://www.raycast.com/blog) provides product-focused close-up covers. Our illustrations similarly focus on what distinguishes each project, while remaining conceptual rather than inventing screenshots.
- [Kim et al., Towards Visualization Thumbnail Designs that Entice Reading Data-driven Articles](https://arxiv.org/html/2305.17051v1), particularly its discussion/design implications, supports concise descriptive text and simplified visuals. It studies data-rich news thumbnails; applying that principle to this portfolio is a design judgment, not evidence of measured engagement gains here.
- [W3C's guidance on images of text](https://www.w3.org/WAI/tutorials/images/textual/) favors actual HTML text and matching text alternatives. The site's HTML project names and summaries remain primary; each cover's alternative text includes its exact title and descriptor. This change does not claim a full accessibility conformance audit.

Grid slots remain 160px tall. The final covers use a panoramic 5:2 composition, approximately matching a 400 × 160 thumbnail. Captioned artwork uses contain sizing, a charcoal backing, no image hover zoom and no theme gradient over its words. This protects the text at narrow mobile widths and unusually wide single-column widths. Legacy covers keep their original crop/gradient behavior. Direct captioned figures use 5:2 sizing and a visible AI-generated conceptual-art caption.

## Final assets

The built-in tool generated 1983 × 793 PNGs. The website uses WebP at the same pixel dimensions, quality 90, effort 6. No composition or creative editing was performed during encoding. Original PNGs and prior drafts remain in the task's generated-images folder. The user requested these replacements; existing stable asset URLs are retained.

| Project title in cover | Descriptor | Saved website asset | Bytes |
| --- | --- | --- | ---: |
| FaultLab | Agent reliability | [faultlab.webp](../public/images/projects/faultlab.webp) | 75602 |
| CORDON | Agent containment | [cordon.webp](../public/images/projects/cordon.webp) | 86876 |
| Options Trading | Replay & order gates | [options-trading.webp](../public/images/projects/options-trading.webp) | 84292 |
| Earshot | Voice to records | [earshot.webp](../public/images/projects/earshot.webp) | 89866 |
| DuckDB | Hash join optimization | [duckdb.webp](../public/images/projects/duckdb.webp) | 97148 |
| Delta Sentinel | Evidence auditing | [delta-sentinel.webp](../public/images/projects/delta-sentinel.webp) | 105172 |
| GenomeCanvas | Protein exploration | [genomecanvas.webp](../public/images/projects/genomecanvas.webp) | 96852 |

Total shipping size for the seven covers: 635808 bytes.

The illustrations are not product screenshots or proof of outcomes. The trading broker connection remains paused. CORDON depicts conceptual software containment. FaultLab and Delta Sentinel keep failures or unresolved review visible. GenomeCanvas shows folded proteins and structure confidence, without medical claims or asserted biological similarity.

## Exact generation prompts and original files

Each final prompt is recorded verbatim below. For the six edits, Image 1 was that project's initial WebP encoding and Image 2 was the final FaultLab PNG listed here as the style reference. Initial PNG paths are retained to recover the first input after replacement.

### FaultLab

Final original PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-c3387dea-f457-479c-bf2a-89e3a05e80c5.png`.

The final image follows an initial typographic edit of the original FaultLab cover. Intermediate PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-8e8b1362-beb5-455e-b400-1f0668547fc1.png`.

Initial typographic edit prompt:

```text
Use case: compositing
Asset type: redesigned typographic software-project cover for the existing FaultLab portfolio thumbnail.
Input images: Image 1 is the edit target and subject/style reference: the existing text-free FaultLab illustration.
Primary request: Make this into a polished editorial project cover with large readable typography and a focused illustration. Recompose the existing scene rather than simply putting small labels over it.
Scene and invariants: Retain the near-black charcoal background, matte graphite, restrained teal glass edges, three isolated test worlds, a contained amber tool failure, and an evidence review gate. These remain conceptual objects, not product screenshots or proof of a successful repair. Compress the three worlds and gate into a strong compact illustration toward the right half, with one amber broken connection clearly visible. Brighten the important subject edges slightly for small-thumbnail readability.
Composition: Wide 16:9 opaque landscape, approximately 1672 by 941. Most of the upper and lower quarter is quiet charcoal. All text must be confined to the central crop-safe rectangle x420 to1252 and y400 to625 in that approximate canvas. Existing site cards center-crop this into very wide 160px banners, and badges occupy the upper corners. Keep the typographic block in the central-left part of that safe rectangle and the illustration on the right, with a clean dark quiet field behind the words. The wordmark and descriptor must survive a central panoramic crop.
Text verbatim: "FaultLab" as the dominant wordmark, and "Agent reliability" directly underneath. Spell FaultLab exactly F-a-u-l-t-L-a-b, including capital F and L. No other text.
Typography: Flat, crisp, elegant bold sans serif in near-white, not rendered on a 3D object. Wordmark around132 source pixels tall, descriptor around64 source pixels tall in soft teal-white, with comfortable spacing. At 300px-wide thumbnail size the wordmark should still read around22px. Do not use tiny captions, decorative terminal code or paragraphs.
Style: Premium restrained engineering editorial cover; retain the existing isometric visual language, but simplify details and make hierarchy decisive. Teal is the main project accent, amber only for the contained fault. No generic shield, humanoid robot, charts, benchmarks, green success checks, logos or watermark.

```

Final panoramic adaptation prompt:

```text
Use case: compositing
Asset type: final FaultLab editorial portfolio cover.
Input image: Image 1 is the edit target: the new FaultLab typographic cover.
Primary request: Adapt this cover to a PANORAMIC 5:2 landscape banner, approximately 1680 pixels wide by672 pixels high. Remove most empty sky and floor while retaining the typography and compact right-hand scene. This is intended to fit 400 by160 project-card images. Do not produce a16:9 canvas.
Composition: generous60px outer safe margins on all sides; all words and important visual forms comfortably within those margins. Large headline on the left, one short descriptor underneath, distinct compact illustration on the right. Leave the upper60px corners quiet for site badges. Title begins about220px down, with the descriptor beneath it; avoid words hugging any edge. Preserve a calm balance between words and illustration.
Text verbatim and only text: "FaultLab" and "Agent reliability". Bold flat near-white sans-serif wordmark about112px tall, soft teal-white descriptor about60px tall. Correct spelling and capitalization, no extra labels.
Invariants: Retain the near-black graphite/teal materials, three isolated test worlds, an amber tool failure in one world, the evidence review gate and receipt tiles. Keep it a conceptual illustration; no approval checkmarks, successful repair claim, metrics, logo or watermark. Opaque charcoal background. Keep the clearly readable hierarchy of the input image.

```

### CORDON

Final original PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-5687af01-ef5d-4f2f-86c8-72c864f6126f.png`.

Initial illustration PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-53263ba9-7665-4f3d-a213-b7a2fedda8cd.png`.

```text
Use case: compositing
Asset type: finished typographic software-project portfolio cover.
Input images: Image 1 is the edit target and source of this project's illustration. Image 2 is a style/composition reference ONLY: the final panoramic FaultLab cover. Use Image 1's distinct subject; never copy FaultLab's test chambers or words.
Primary request: Recompose Image 1 into a strong editorial cover in the same family as Image 2, with a LARGE project name and one concise descriptor on the left, plus a simplified recognizable project illustration on the right.
Canvas: PANORAMIC 5:2 landscape banner, approximately1680 by672 pixels. Do not produce a16:9 canvas. Opaque near-black charcoal background. Remove excessive empty sky and floor; leave60px safe outer margins and a quiet upper60px for the site's corner badges.
Text (verbatim): "CORDON" as the dominant headline and "Agent containment" directly underneath. These are the only words. Spell both exactly, preserve case and punctuation.
Typography: Flat crisp heavy modern sans serif, near-white headline, high-contrast softly tinted descriptor. The headline should occupy roughly40% of canvas width and read at around24-30px when the whole cover is reduced to400px wide. Descriptor around13-16px at that size. Shorter names can use about130 source-pixel type; the longer two-word names about100px. Never use tiny type, perspective-distorted lettering, terminal-code paragraphs or extra labels.
Layout: generous separation between the text block and right-hand subject, as in Image 2. Center the whole composition vertically. Headline around220px from the top, descriptor underneath with comfortable spacing. Keep words away from corners and borders. Simplify details so the idea stays distinct at small card size.
Project subject and invariants: an agent network with an amber two-node quarantined branch, an interrupted link, a reference-monitor checkpoint, a protected violet credential vault and audit-record tiles; no claim of guaranteed security or hardware isolation.
Palette and visual identity: teal connections with restrained violet vault light; amber only for the quarantined branch. Premium matte graphite with restrained translucent edges, quiet technical grid and soft studio lighting. Retain the material treatment of Image 1 while improving contrast and hierarchy. Use a different subject silhouette from the FaultLab reference.
Constraints: conceptual illustration, not a screenshot or evidence of validated outcomes. No statistics, benchmark charts, green approval checks, human figures, robots, financial symbols, third-party logos, invented product UI text or watermark. Preserve the project's stated uncertainty and paused/failure states.

```

### Options Trading

Final original PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-d66e7617-e034-4c9f-a3a3-f0098c249b8d.png`.

Initial illustration PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-0f60c6d8-186d-449f-9f51-c98231926db7.png`.

```text
Use case: compositing
Asset type: finished typographic software-project portfolio cover.
Input images: Image 1 is the edit target and source of this project's illustration. Image 2 is a style/composition reference ONLY: the final panoramic FaultLab cover. Use Image 1's distinct subject; never copy FaultLab's test chambers or words.
Primary request: Recompose Image 1 into a strong editorial cover in the same family as Image 2, with a LARGE project name and one concise descriptor on the left, plus a simplified recognizable project illustration on the right.
Canvas: PANORAMIC 5:2 landscape banner, approximately1680 by672 pixels. Do not produce a16:9 canvas. Opaque near-black charcoal background. Remove excessive empty sky and floor; leave60px safe outer margins and a quiet upper60px for the site's corner badges.
Text (verbatim): "Options Trading" as the dominant headline and "Replay & order gates" directly underneath. These are the only words. Spell both exactly, preserve case and punctuation.
Typography: Flat crisp heavy modern sans serif, near-white headline, high-contrast softly tinted descriptor. The headline should occupy roughly40% of canvas width and read at around24-30px when the whole cover is reduced to400px wide. Descriptor around13-16px at that size. Shorter names can use about130 source-pixel type; the longer two-word names about100px. Never use tiny type, perspective-distorted lettering, terminal-code paragraphs or extra labels.
Layout: generous separation between the text block and right-hand subject, as in Image 2. Center the whole composition vertically. Headline around220px from the top, descriptor underneath with comfortable spacing. Keep words away from corners and borders. Simplify details so the idea stays distinct at small card size.
Project subject and invariants: a replay circle surrounding an event ledger, a short sequence of order-admission gates and a final broker connection visibly broken/paused with an amber pause glyph; no orders crossing the gap, no price charts or profitable-trading imagery.
Palette and visual identity: cool cyan replay arcs and a small amber paused broker connection. Premium matte graphite with restrained translucent edges, quiet technical grid and soft studio lighting. Retain the material treatment of Image 1 while improving contrast and hierarchy. Use a different subject silhouette from the FaultLab reference.
Constraints: conceptual illustration, not a screenshot or evidence of validated outcomes. No statistics, benchmark charts, green approval checks, human figures, robots, financial symbols, third-party logos, invented product UI text or watermark. Preserve the project's stated uncertainty and paused/failure states.

```

### Earshot

Final original PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-061adcbd-a1e6-4498-80fa-a5478aa8a7f5.png`.

Initial illustration PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-a2e16095-b73d-418d-9543-b1ee133c3bb0.png`.

```text
Use case: compositing
Asset type: finished typographic software-project portfolio cover.
Input images: Image 1 is the edit target and source of this project's illustration. Image 2 is a style/composition reference ONLY: the final panoramic FaultLab cover. Use Image 1's distinct subject; never copy FaultLab's test chambers or words.
Primary request: Recompose Image 1 into a strong editorial cover in the same family as Image 2, with a LARGE project name and one concise descriptor on the left, plus a simplified recognizable project illustration on the right.
Canvas: PANORAMIC 5:2 landscape banner, approximately1680 by672 pixels. Do not produce a16:9 canvas. Opaque near-black charcoal background. Remove excessive empty sky and floor; leave60px safe outer margins and a quiet upper60px for the site's corner badges.
Text (verbatim): "Earshot" as the dominant headline and "Voice to records" directly underneath. These are the only words. Spell both exactly, preserve case and punctuation.
Typography: Flat crisp heavy modern sans serif, near-white headline, high-contrast softly tinted descriptor. The headline should occupy roughly40% of canvas width and read at around24-30px when the whole cover is reduced to400px wide. Descriptor around13-16px at that size. Shorter names can use about130 source-pixel type; the longer two-word names about100px. Never use tiny type, perspective-distorted lettering, terminal-code paragraphs or extra labels.
Layout: generous separation between the text block and right-hand subject, as in Image 2. Center the whole composition vertically. Headline around220px from the top, descriptor underneath with comfortable spacing. Keep words away from corners and borders. Simplify details so the idea stays distinct at small card size.
Project subject and invariants: a flowing blue-violet voice waveform entering one compact processor, then parallel speech and typed-record tiles with one amber mismatched pair and a correction loop before the record stack; no names, perfect-transcription claim or readable customer data.
Palette and visual identity: bright blue-violet waveform, teal record tiles, one amber discrepancy. Premium matte graphite with restrained translucent edges, quiet technical grid and soft studio lighting. Retain the material treatment of Image 1 while improving contrast and hierarchy. Use a different subject silhouette from the FaultLab reference.
Constraints: conceptual illustration, not a screenshot or evidence of validated outcomes. No statistics, benchmark charts, green approval checks, human figures, robots, financial symbols, third-party logos, invented product UI text or watermark. Preserve the project's stated uncertainty and paused/failure states.

```

### DuckDB

Final original PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-1e91ecc0-7c33-40c2-ba83-bf655abf226b.png`.

Initial illustration PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-d1437458-33ab-47f8-9118-034555fd9a5a.png`.

```text
Use case: compositing
Asset type: finished typographic software-project portfolio cover.
Input images: Image 1 is the edit target and source of this project's illustration. Image 2 is a style/composition reference ONLY: the final panoramic FaultLab cover. Use Image 1's distinct subject; never copy FaultLab's test chambers or words.
Primary request: Recompose Image 1 into a strong editorial cover in the same family as Image 2, with a LARGE project name and one concise descriptor on the left, plus a simplified recognizable project illustration on the right.
Canvas: PANORAMIC 5:2 landscape banner, approximately1680 by672 pixels. Do not produce a16:9 canvas. Opaque near-black charcoal background. Remove excessive empty sky and floor; leave60px safe outer margins and a quiet upper60px for the site's corner badges.
Text (verbatim): "DuckDB" as the dominant headline and "Hash join optimization" directly underneath. These are the only words. Spell both exactly, preserve case and punctuation. DuckDB is spelled D-u-c-k-D-B.
Typography: Flat crisp heavy modern sans serif, near-white headline, high-contrast softly tinted descriptor. The headline should occupy roughly40% of canvas width and read at around24-30px when the whole cover is reduced to400px wide. Descriptor around13-16px at that size. Shorter names can use about130 source-pixel type; the longer two-word names about100px. Never use tiny type, perspective-distorted lettering, terminal-code paragraphs or extra labels.
Layout: generous separation between the text block and right-hand subject, as in Image 2. Center the whole composition vertically. Headline around220px from the top, descriptor underneath with comfortable spacing. Keep words away from corners and borders. Simplify details so the idea stays distinct at small card size.
Project subject and invariants: two streams of data tiles entering a translucent Bloom-filter lattice, some excluded amber tiles peeling away, candidate teal rows flowing into a small hash-table grid and a few prefetched cache slabs; no speedup figures or perfect-filter claim.
Palette and visual identity: emerald-teal filter and cache edges with muted violet secondary data tiles. Premium matte graphite with restrained translucent edges, quiet technical grid and soft studio lighting. Retain the material treatment of Image 1 while improving contrast and hierarchy. Use a different subject silhouette from the FaultLab reference.
Constraints: conceptual illustration, not a screenshot or evidence of validated outcomes. No statistics, benchmark charts, green approval checks, human figures, robots, financial symbols, third-party logos, invented product UI text or watermark. Preserve the project's stated uncertainty and paused/failure states.

```

### Delta Sentinel

Final original PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-b0b35a9d-5995-4abb-8064-e95911e9bcb3.png`.

Initial illustration PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-3572059d-e0c0-4c71-9c65-2c2914f56c20.png`.

```text
Use case: compositing
Asset type: finished typographic software-project portfolio cover.
Input images: Image 1 is the edit target and source of this project's illustration. Image 2 is a style/composition reference ONLY: the final panoramic FaultLab cover. Use Image 1's distinct subject; never copy FaultLab's test chambers or words.
Primary request: Recompose Image 1 into a strong editorial cover in the same family as Image 2, with a LARGE project name and one concise descriptor on the left, plus a simplified recognizable project illustration on the right.
Canvas: PANORAMIC 5:2 landscape banner, approximately1680 by672 pixels. Do not produce a16:9 canvas. Opaque near-black charcoal background. Remove excessive empty sky and floor; leave60px safe outer margins and a quiet upper60px for the site's corner badges.
Text (verbatim): "Delta Sentinel" as the dominant headline and "Evidence auditing" directly underneath. These are the only words. Spell both exactly, preserve case and punctuation.
Typography: Flat crisp heavy modern sans serif, near-white headline, high-contrast softly tinted descriptor. The headline should occupy roughly40% of canvas width and read at around24-30px when the whole cover is reduced to400px wide. Descriptor around13-16px at that size. Shorter names can use about130 source-pixel type; the longer two-word names about100px. Never use tiny type, perspective-distorted lettering, terminal-code paragraphs or extra labels.
Layout: generous separation between the text block and right-hand subject, as in Image 2. Center the whole composition vertically. Headline around220px from the top, descriptor underneath with comfortable spacing. Keep words away from corners and borders. Simplify details so the idea stays distinct at small card size.
Project subject and invariants: two parallel paired experiment-record streams entering an inspection lens and a compact comparison frame; one amber discrepancy remains unresolved, with a final open review record; keep abstract shapes and no actual data, accepted verdict or improvement claim.
Palette and visual identity: cool violet comparison rails with focused amber discrepancy light and teal lens detail. Premium matte graphite with restrained translucent edges, quiet technical grid and soft studio lighting. Retain the material treatment of Image 1 while improving contrast and hierarchy. Use a different subject silhouette from the FaultLab reference.
Constraints: conceptual illustration, not a screenshot or evidence of validated outcomes. No statistics, benchmark charts, green approval checks, human figures, robots, financial symbols, third-party logos, invented product UI text or watermark. Preserve the project's stated uncertainty and paused/failure states.

```

A focused correction replaced misleading biological symbols with software record motifs. Intermediate typographic PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-feff97a6-987c-4887-8340-15de0e6da579.png`.

```text
Use case: precise-object-edit
Asset type: final Delta Sentinel software-evidence auditing cover.
Input image: Image 1 is the edit target.
Primary request: Make ONE focused correction: replace EVERY leaf/botanical silhouette and EVERY microbe/molecular blob symbol on the evidence tiles with abstract rectangular software-record rows and simple field-alignment motifs. This project audits claims about AI agent improvements; biological imagery gives the wrong impression.
Specific change: paired tiles should contain matching horizontal data-row patterns and neutral rectangular field blocks, with one amber tile showing a shifted/mismatched field. The central two records and the open final review record should clearly resemble generic software experiment evidence, never leaf specimens or biology. Do not add readable data or extra text.
Invariants: Preserve EXACTLY the two existing text strings "Delta Sentinel" and "Evidence auditing", their font, scale and positions. Preserve the panoramic5:2 dimensions, charcoal backdrop, paired teal/violet evidence rails, audit lens/inspection frame, amber discrepancy, material treatment, composition and lighting. Keep the final review unresolved; no green pass checks, successful improvement claim, metrics or watermark. Change only the misleading symbols and record motifs.

```

### GenomeCanvas

Final original PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-2bcb7fbf-3f1f-4c25-879e-1c48cd79908d.png`.

Initial illustration PNG: `/Users/shree/.codex/generated_images/01a10879-a20b-7440-a276-9a54d4bb6e47/exec-72dd9df5-1e20-42ba-8873-0f5d94c12d82.png`.

```text
Use case: compositing
Asset type: finished typographic software-project portfolio cover.
Input images: Image 1 is the edit target and source of this project's illustration. Image 2 is a style/composition reference ONLY: the final panoramic FaultLab cover. Use Image 1's distinct subject; never copy FaultLab's test chambers or words.
Primary request: Recompose Image 1 into a strong editorial cover in the same family as Image 2, with a LARGE project name and one concise descriptor on the left, plus a simplified recognizable project illustration on the right.
Canvas: PANORAMIC 5:2 landscape banner, approximately1680 by672 pixels. Do not produce a16:9 canvas. Opaque near-black charcoal background. Remove excessive empty sky and floor; leave60px safe outer margins and a quiet upper60px for the site's corner badges.
Text (verbatim): "GenomeCanvas" as the dominant headline and "Protein exploration" directly underneath. These are the only words. Spell both exactly, preserve case and punctuation. GenomeCanvas is spelled G-e-n-o-m-e-C-a-n-v-a-s.
Typography: Flat crisp heavy modern sans serif, near-white headline, high-contrast softly tinted descriptor. The headline should occupy roughly40% of canvas width and read at around24-30px when the whole cover is reduced to400px wide. Descriptor around13-16px at that size. Shorter names can use about130 source-pixel type; the longer two-word names about100px. Never use tiny type, perspective-distorted lettering, terminal-code paragraphs or extra labels.
Layout: generous separation between the text block and right-hand subject, as in Image 2. Center the whole composition vertically. Headline around220px from the top, descriptor underneath with comfortable spacing. Keep words away from corners and borders. Simplify details so the idea stays distinct at small card size.
Project subject and invariants: a clearly recognizable selected folded protein ribbon with teal-violet structure-confidence shading and one amber uncertain segment, two quieter protein ribbons nearby, a subtle selection outline and a small abstract UI command tile; no DNA double helix, medical/drug-discovery claim or edges asserting biological similarity.
Palette and visual identity: rich restrained violet and teal protein ribbons, amber only for the confidence variation. Premium matte graphite with restrained translucent edges, quiet technical grid and soft studio lighting. Retain the material treatment of Image 1 while improving contrast and hierarchy. Use a different subject silhouette from the FaultLab reference.
Constraints: conceptual illustration, not a screenshot or evidence of validated outcomes. No statistics, benchmark charts, green approval checks, human figures, robots, financial symbols, third-party logos, invented product UI text or watermark. Preserve the project's stated uncertainty and paused/failure states.

```
