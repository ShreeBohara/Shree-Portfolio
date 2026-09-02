import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { workSchema } from './src/content/schema';

const work = defineCollection({
  name: 'work',
  directory: 'content/work',
  include: '**/*.mdx',
  schema: workSchema,
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    const slug = document._meta.path;

    // Section ids double as citation anchors: the assistant cites
    // /work/<slug>#<section>, so the ids have to be derived the same way the
    // rendered headings derive them.
    const headings = Array.from(document.content.matchAll(/^##\s+(.+)$/gm)).map((match) => {
      const text = match[1].trim();
      return {
        text,
        id: text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-'),
      };
    });

    // Every <Fact id="..."/> in the body must resolve to a declared metric.
    const factIds = Array.from(document.content.matchAll(/<Fact\s+id="([^"]+)"/g)).map((m) => m[1]);
    const declared = new Set(document.metrics.map((metric) => metric.id));
    const unknownFacts = factIds.filter((id) => !declared.has(id));

    if (unknownFacts.length > 0) {
      throw new Error(
        `${slug}.mdx references undeclared metric id(s): ${unknownFacts.join(', ')}. ` +
          `Add them to the metrics array with a provenance tag and a source, or fix the id.`
      );
    }

    return { ...document, slug, mdx, headings, url: `/work/${slug}` };
  },
});

export default defineConfig({
  collections: [work],
});
