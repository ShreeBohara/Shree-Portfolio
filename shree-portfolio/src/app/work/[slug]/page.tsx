import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXContent } from '@content-collections/mdx/react';
import { workWithPages, workBySlug, publishableAwards } from '@/lib/content';
import { mdxComponents } from '@/components/mdx';
import { personalInfo, projects } from '@/data/portfolio';

/**
 * Provisional renderer for the new content layer.
 *
 * The real templates (case study and standard) land in Phase 3. This route
 * exists so the pipeline is exercised end to end — frontmatter, MDX body, Fact
 * receipts and heading anchors — while the live site still serves the old
 * /projects pages. It is noindex until the copy for every project is written.
 */

export function generateStaticParams() {
  return workWithPages().map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) return {};

  return {
    title: work.title,
    description: work.summary,
    robots: { index: false, follow: false },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = workBySlug(slug);

  if (!work || work.tier === 'one-liner') notFound();

  const awards = publishableAwards(work);
  const project = projects.find((item) => item.links.caseStudy === `/work/${work.slug}`);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav aria-label="Case study navigation" className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {project && (
          <Link href={`/projects/${project.slug}`} className="underline underline-offset-4 hover:text-foreground">
            Back to project
          </Link>
        )}
        <Link href="/browse?section=projects" className="underline underline-offset-4 hover:text-foreground">
          Browse projects
        </Link>
      </nav>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {work.dates.display ?? `${work.dates.start} – ${work.dates.end}`} · {work.status}
      </p>

      <h1 className="mt-2 text-3xl font-semibold">{work.title}</h1>
      {work.subtitle && <p className="mt-1 text-lg text-muted-foreground">{work.subtitle}</p>}

      {awards.length > 0 && (
        <p className="mt-4 font-mono text-sm">
          {awards.map((award) => `${award.placement} — ${award.name}${award.fieldSize ? ` (${award.fieldSize})` : ''}`).join(' · ')}
        </p>
      )}

      <p className="mt-6 text-muted-foreground">{work.summary}</p>

      <div className="mt-10">
        <MDXContent code={work.mdx} components={mdxComponents(work.metrics)} />
      </div>

      <section className="mt-12 rounded-lg border p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide">How it was built</h2>
        <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div>
            <dt className="inline font-medium text-foreground">Time: </dt>
            <dd className="inline">{work.builtWith.duration}</dd>
          </div>
          {work.builtWith.tools.length > 0 && (
            <div>
              <dt className="inline font-medium text-foreground">Tools: </dt>
              <dd className="inline">{work.builtWith.tools.join(', ')}</dd>
            </div>
          )}
          <div>
            <dt className="inline font-medium text-foreground">My contribution: </dt>
            <dd className="inline">{work.builtWith.handWritten}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-foreground">Validation: </dt>
            <dd className="inline">{work.builtWith.notBroken}</dd>
          </div>
        </dl>
      </section>
      <nav aria-label="After the case study" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 text-sm text-muted-foreground">
        <Link href="/browse?section=projects" className="underline underline-offset-4 hover:text-foreground">
          Browse projects
        </Link>
        <a href={`mailto:${personalInfo.links.email}`} className="underline underline-offset-4 hover:text-foreground">
          Email Shree
        </a>
      </nav>
    </article>
  );
}
