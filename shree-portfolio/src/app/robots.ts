import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreebohara.com'

  // One group for every crawler, including AI crawlers: the pages are open,
  // the API is not. Per-user-agent groups are deliberately avoided — under the
  // robots exclusion protocol a named group replaces the wildcard group, which
  // previously let named crawlers ignore the /api disallow.
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
