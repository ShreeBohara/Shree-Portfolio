import { personalInfo, projects, experiences, education } from '@/data/portfolio'
import { Project, Experience } from '@/data/types'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreebohara.com'

// Person Schema for main profile
export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    description: personalInfo.bio,
    url: baseUrl,
    image: `${baseUrl}/profile-image.jpg`,
    email: personalInfo.links.email,
    alumniOf: [
      {
        '@type': 'Organization',
        name: 'University of Southern California',
        sameAs: 'https://www.usc.edu',
      },
      {
        '@type': 'Organization',
        name: 'MIT-WPU',
        sameAs: 'https://mitwpu.edu.in',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    sameAs: [
      personalInfo.links.github,
      personalInfo.links.linkedin,
      personalInfo.links.twitter,
    ],
    knowsAbout: [
      ...personalInfo.skills.flatMap(category => category.items),
    ],
    workLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: personalInfo.location,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WebSite Schema with navigation
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shree Bohara Portfolio',
    description: 'USC CS Graduate Student specializing in AI/ML and Full-Stack Development',
    url: baseUrl,
    author: {
      '@type': 'Person',
      name: personalInfo.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQPage Schema
export function FAQPageSchema() {
  // Extract FAQs from portfolio data
  const faqs = personalInfo.faqs || []

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// BreadcrumbList Schema
export function BreadcrumbListSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ItemList Schema for collections (projects, experience, etc.)
export function ItemListSchema({
  items,
  name,
  description
}: {
  items: Array<{ name: string; url: string; description?: string }>,
  name: string,
  description: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Article/CreativeWork Schema for individual projects
export function ProjectSchema({ project }: { project: Project }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    author: {
      '@type': 'Person',
      name: personalInfo.name,
    },
    dateCreated: `${project.year}-01-01`,
    keywords: project.tags.join(', '),
    about: project.category,
    url: `${baseUrl}/projects/${project.slug}`,
    creator: {
      '@type': 'Person',
      name: personalInfo.name,
    },
    ...(project.links?.github && {
      codeRepository: project.links.github,
    }),
    ...(project.links?.live && {
      workExample: {
        '@type': 'WebApplication',
        url: project.links.live,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WorkExperience Schema for individual experience pages
export function WorkExperienceSchema({ experience }: { experience: Experience }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    hasOccupation: {
      '@type': 'Occupation',
      name: experience.role,
      occupationLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: experience.location,
        },
      },
      estimatedSalary: null,
      description: experience.highlights.map(h => h.text).join(' '),
      skills: experience.technologies.join(', '),
    },
    worksFor: {
      '@type': 'Organization',
      name: experience.company,
      ...(experience.links?.company && { url: experience.links.company }),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// QAPage Schema for chat interface
export function QAPageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    name: 'Shree Bohara - Interactive Portfolio Chat',
    description: 'Chat with an AI-powered assistant to learn about Shree Bohara\'s projects, experience, and skills',
    mainEntity: {
      '@type': 'Question',
      name: 'Ask me anything about my projects, experience, and skills',
      text: 'Interactive AI assistant powered by RAG and vector search to answer questions about my portfolio',
      answerCount: 0,
      author: {
        '@type': 'Person',
        name: personalInfo.name,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// CollectionPage Schema for browse page
export function CollectionPageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Shree Bohara - Projects & Experience',
    description: 'Browse all projects, work experience, and education',
    url: `${baseUrl}/browse`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length + experiences.length + education.length,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
