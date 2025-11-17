import { Metadata } from 'next'
import { BreadcrumbListSchema, ItemListSchema, CollectionPageSchema } from '@/lib/schemas'
import { projects, experiences, education } from '@/data/portfolio'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreebohara.com'

export const metadata: Metadata = {
  title: 'Browse Portfolio',
  description: 'Explore Shree Bohara\'s projects, work experience, and education. View AI/ML projects, full-stack applications, and professional experience at QuinStreet and DeepTek.',
  keywords: ['projects', 'portfolio', 'experience', 'education', 'AI projects', 'full-stack developer', 'Shree Bohara work'],

  openGraph: {
    title: 'Browse Portfolio - Shree Bohara',
    description: 'Explore Shree Bohara\'s projects, work experience, and education. View AI/ML projects, full-stack applications, and professional experience.',
    type: 'website',
    url: `${baseUrl}/browse`,
    siteName: 'Shree Bohara Portfolio',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Shree Bohara - Portfolio Browse',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Browse Portfolio - Shree Bohara',
    description: 'Explore Shree Bohara\'s projects, work experience, and education. View AI/ML projects, full-stack applications, and professional experience.',
    images: [`${baseUrl}/og-image.png`],
  },

  alternates: {
    canonical: `${baseUrl}/browse`,
  },
}

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Prepare breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Browse', url: `${baseUrl}/browse` },
  ]

  // Prepare ItemList data for all projects
  const projectItems = projects.map(project => ({
    name: project.title,
    url: `${baseUrl}/projects/${project.slug}`,
    description: project.summary,
  }))

  return (
    <>
      <BreadcrumbListSchema items={breadcrumbs} />
      <ItemListSchema
        items={projectItems}
        name="Shree Bohara's Projects"
        description="A collection of AI/ML and full-stack development projects"
      />
      <CollectionPageSchema />
      {children}
    </>
  )
}
