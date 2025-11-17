import { Metadata } from 'next'
import { personalInfo, projects, experiences, education } from '@/data/portfolio'
import { PersonSchema, BreadcrumbListSchema } from '@/lib/schemas'
import { PortfolioLayout } from '@/components/layout/PortfolioLayout'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreebohara.com'

export const metadata: Metadata = {
  title: 'About Shree Bohara',
  description: `${personalInfo.bio} Learn about background, skills, and career journey.`,
  keywords: [
    'about',
    'Shree Bohara',
    'software engineer',
    'USC',
    'computer science',
    'AI/ML',
    'full-stack developer',
  ],

  openGraph: {
    title: 'About Shree Bohara',
    description: `${personalInfo.tagline}. ${personalInfo.bio.substring(0, 150)}...`,
    type: 'profile',
    url: `${baseUrl}/about`,
    siteName: 'Shree Bohara Portfolio',
    images: [
      {
        url: `${baseUrl}/api/og?title=About Shree Bohara&category=Software Engineer`,
        width: 1200,
        height: 630,
        alt: 'About Shree Bohara',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'About Shree Bohara',
    description: `${personalInfo.tagline}. ${personalInfo.bio.substring(0, 150)}...`,
    images: [`${baseUrl}/api/og?title=About Shree Bohara&category=Software Engineer`],
  },

  alternates: {
    canonical: `${baseUrl}/about`,
  },
}

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'About', url: `${baseUrl}/about` },
  ]

  return (
    <>
      <PersonSchema />
      <BreadcrumbListSchema items={breadcrumbs} />

      <PortfolioLayout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">{personalInfo.name}</h1>
            <p className="text-2xl text-primary mb-2">{personalInfo.title}</p>
            <p className="text-xl text-muted-foreground mb-4">{personalInfo.tagline}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>📍 {personalInfo.location}</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                {personalInfo.availability.status}
              </span>
            </div>
          </div>

          {/* Bio */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">About Me</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{personalInfo.bio}</p>
            </div>
          </section>

          {/* Career Story */}
          {personalInfo.careerStory && (
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-4">My Journey</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Background</h3>
                  <p className="text-muted-foreground">{personalInfo.careerStory.background}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Inspiration</h3>
                  <p className="text-muted-foreground">{personalInfo.careerStory.inspiration}</p>
                </div>
              </div>
            </section>
          )}

          {/* Skills */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {personalInfo.skills.map((skillCategory, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">{skillCategory.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Summary */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Experience</h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary pl-6">
                  <div className="text-sm text-muted-foreground mb-1">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </div>
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-primary mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {exp.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i} className="text-sm">
                        {highlight.text}
                        {highlight.metric && <span className="text-primary ml-1">({highlight.metric})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Education</h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-primary pl-6">
                  <div className="text-sm text-muted-foreground mb-1">
                    {edu.startYear} - {edu.endYear}
                  </div>
                  <h3 className="text-xl font-semibold">{edu.degree} in {edu.field}</h3>
                  <p className="text-primary mb-2">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
                  {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold mb-1">Relevant Courses:</p>
                      <div className="flex flex-wrap gap-1">
                        {edu.relevantCoursework.map((course, i) => (
                          <span key={i} className="text-xs text-muted-foreground">
                            {course}{i < edu.relevantCoursework.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Projects Summary */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground mb-4">
              I've built {projects.length} projects across AI/ML, full-stack development, and data engineering.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).map((project) => (
                <a
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.summary.substring(0, 100)}...</p>
                </a>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href={`mailto:${personalInfo.links.email}`}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Email Me
              </a>
              <a
                href={personalInfo.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={personalInfo.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                GitHub
              </a>
              {personalInfo.links.calendar && (
                <a
                  href={personalInfo.links.calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Schedule a Call
                </a>
              )}
            </div>
          </section>
        </div>
      </PortfolioLayout>
    </>
  )
}
