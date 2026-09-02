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
    a: (props: ComponentProps<'a'>) => (
      <a {...props} className="underline underline-offset-4 hover:text-accent-color" />
    ),
  };
}
