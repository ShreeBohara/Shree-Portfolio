import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { experiences } from '@/data/portfolio'
import { WorkExperienceSchema, BreadcrumbListSchema } from '@/lib/schemas'
import { PortfolioLayout } from '@/components/layout/PortfolioLayout'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreebohara.com'

// Generate static params for all experiences
export async function generateStaticParams() {
  return experiences.map((experience) => ({
    id: experience.id,
  }))
}

// Generate metadata for each experience
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const experience = experiences.find((e) => e.id === id)

  if (!experience) {
    return {
      title: 'Experience Not Found',
    }
  }

  const description = `${experience.role} at ${experience.company}. ${experience.highlights[0]}`
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(experience.role)}&category=${encodeURIComponent(experience.company)}`

  return {
    title: `${experience.role} at ${experience.company}`,
    description,
    keywords: [
      ...experience.technologies,
      experience.company,
      experience.role,
      'Shree Bohara',
      'work experience',
    ],

    openGraph: {
      title: `${experience.role} at ${experience.company} - Shree Bohara`,
      description,
      type: 'profile',
      url: `${baseUrl}/experience/${experience.id}`,
      siteName: 'Shree Bohara Portfolio',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${experience.role} at ${experience.company}`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${experience.role} at ${experience.company} - Shree Bohara`,
      description,
      images: [ogImage],
    },

    alternates: {
      canonical: `${baseUrl}/experience/${experience.id}`,
    },
  }
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experience = experiences.find((e) => e.id === id)

  if (!experience) {
    notFound()
  }

  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Browse', url: `${baseUrl}/browse` },
    { name: 'Experience', url: `${baseUrl}/browse?section=experience` },
    { name: experience.company, url: `${baseUrl}/experience/${experience.id}` },
  ]

  return (
    <>
      <WorkExperienceSchema experience={experience} />
      <BreadcrumbListSchema items={breadcrumbs} />

      <PortfolioLayout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-2">
              {experience.startDate} - {experience.endDate || 'Present'} • {experience.location}
            </div>
            <h1 className="text-4xl font-bold mb-2">{experience.role}</h1>
            <p className="text-2xl text-primary mb-4">{experience.company}</p>
            {experience.summary && (
              <p className="text-muted-foreground">{experience.summary}</p>
            )}
            {experience.companyInfo && (
              <div className="mt-2 text-sm text-muted-foreground">
                {experience.companyInfo.industry && <span>{experience.companyInfo.industry}</span>}
                {experience.companyInfo.size && <span> • {experience.companyInfo.size}</span>}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Achievements</h2>
              <ul className="space-y-3">
                {experience.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">▸</span>
                    <span className="text-muted-foreground">
                      {highlight.text}
                      {highlight.metric && <span className="font-semibold text-primary ml-2">{highlight.metric}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Technologies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Company Link */}
            {(experience.links?.company || experience.links?.project) && (
              <section>
                <div className="flex gap-4">
                  {experience.links.company && (
                    <a
                      href={experience.links.company}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Visit {experience.company}
                    </a>
                  )}
                  {experience.links.project && (
                    <a
                      href={experience.links.project}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      View Project
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </PortfolioLayout>
    </>
  )
}
