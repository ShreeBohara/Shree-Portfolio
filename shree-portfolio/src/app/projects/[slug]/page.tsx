import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects } from '@/data/portfolio'
import { ProjectSchema, BreadcrumbListSchema } from '@/lib/schemas'
import { PortfolioLayout } from '@/components/layout/PortfolioLayout'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreebohara.com'

// Generate static params for all projects
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

// Generate metadata for each project
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(project.title)}&category=${encodeURIComponent(project.category)}`

  return {
    title: project.title,
    description: project.summary,
    keywords: [...project.tags, project.category, 'Shree Bohara', 'portfolio'],

    openGraph: {
      title: `${project.title} - Shree Bohara`,
      description: project.summary,
      type: 'article',
      url: `${baseUrl}/projects/${project.slug}`,
      siteName: 'Shree Bohara Portfolio',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      publishedTime: `${project.year}-01-01`,
      tags: project.tags,
    },

    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - Shree Bohara`,
      description: project.summary,
      images: [ogImage],
    },

    alternates: {
      canonical: `${baseUrl}/projects/${project.slug}`,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Browse', url: `${baseUrl}/browse` },
    { name: 'Projects', url: `${baseUrl}/browse?section=projects` },
    { name: project.title, url: `${baseUrl}/projects/${project.slug}` },
  ]

  return (
    <>
      <ProjectSchema project={project} />
      <BreadcrumbListSchema items={breadcrumbs} />

      <PortfolioLayout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-2">
              {project.category} • {project.year}
            </div>
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.summary}</p>
          </div>

          <div className="space-y-8">
            {/* Problem */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">Problem</h2>
              <p className="text-muted-foreground">{project.problem}</p>
            </section>

            {/* Approach */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">Approach</h2>
              <p className="text-muted-foreground">{project.approach}</p>
            </section>

            {/* Impact */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">Impact</h2>
              <p className="text-muted-foreground">{project.impact}</p>
            </section>

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Key Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.metrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Technologies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Links */}
            {project.links && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Links</h2>
                <div className="flex gap-4">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      View on GitHub
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* My Role */}
            {project.myRole && (
              <section>
                <h2 className="text-2xl font-semibold mb-3">My Role</h2>
                <p className="text-muted-foreground">{project.myRole}</p>
                {project.teamSize && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Team Size: {project.teamSize} {project.teamSize === 1 ? 'person' : 'people'}
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </PortfolioLayout>
    </>
  )
}
