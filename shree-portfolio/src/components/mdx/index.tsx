import type { ComponentProps } from 'react';
import { Fact, type FactData } from './Fact';

/**
 * Components available inside MDX bodies.
 *
 * `Fact` is written as `<Fact id="attack-success" />`: the body names a metric,
 * the frontmatter defines it, and the build fails if the id does not resolve.
 * Prose therefore cannot contain a number that has no provenance attached.
 */
export function mdxComponents(metrics: FactData[]) {
  const byId = new Map(metrics.map((metric) => [metric.id, metric]));

  return {
    Fact: ({ id }: { id: string }) => {
      const fact = byId.get(id);
      if (!fact) return null; // unreachable: the build rejects unknown ids
      return <Fact fact={fact} />;
    },
    h2: (props: ComponentProps<'h2'>) => (
      <h2 {...props} className="mt-10 mb-3 text-xl font-semibold scroll-mt-24" />
    ),
    p: (props: ComponentProps<'p'>) => (
      <p {...props} className="mb-4 leading-relaxed text-muted-foreground" />
    ),
    ol: (props: ComponentProps<'ol'>) => (
      <ol {...props} className="mb-4 ml-6 list-decimal space-y-2 leading-relaxed text-muted-foreground" />
    ),
    ul: (props: ComponentProps<'ul'>) => (
      <ul {...props} className="mb-4 ml-6 list-disc space-y-2 leading-relaxed text-muted-foreground" />
    ),
    ComparisonTable: (props: ComponentProps<'table'>) => (
      <div className="mb-4 overflow-x-auto lg:overflow-visible">
        <table {...props} className="w-full border-collapse text-left text-sm text-muted-foreground [&_caption]:mb-2 [&_caption]:text-left [&_caption]:font-medium [&_caption]:text-foreground [&_th]:border-b [&_th]:px-3 [&_th]:py-2 [&_th]:align-top [&_th]:font-medium [&_th]:text-foreground [&_td]:border-b [&_td]:px-3 [&_td]:py-2 [&_td]:align-top" />
      </div>
    ),
    a: (props: ComponentProps<'a'>) => (
      <a {...props} className="underline underline-offset-4 hover:text-accent-color" />
    ),
  };
}
