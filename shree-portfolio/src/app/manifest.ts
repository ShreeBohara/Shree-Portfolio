import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shree Bohara - Portfolio',
    short_name: 'Shree Bohara',
    description: 'Shree Bohara — Software Engineer at QuinStreet in San Francisco. Projects, experience, and an assistant that answers from them.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    // Uncomment when you add icon files to public/ directory
    // icons: [
    //   {
    //     src: '/icon-192.png',
    //     sizes: '192x192',
    //     type: 'image/png',
    //     purpose: 'any maskable',
    //   },
    //   {
    //     src: '/icon-512.png',
    //     sizes: '512x512',
    //     type: 'image/png',
    //     purpose: 'any maskable',
    //   },
    // ],
    categories: ['portfolio', 'professional', 'developer', 'technology'],
    lang: 'en-US',
    dir: 'ltr',
  }
}
