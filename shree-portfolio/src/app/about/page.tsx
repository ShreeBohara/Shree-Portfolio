import { Metadata } from 'next'
import { personalInfo } from '@/data/portfolio'
import { PersonSchema, BreadcrumbListSchema } from '@/lib/schemas'
import { PortfolioLayout } from '@/components/layout/PortfolioLayout'
import { AboutContent } from '@/components/about/AboutContent'

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
        <AboutContent />
      </PortfolioLayout>
    </>
  )
}
