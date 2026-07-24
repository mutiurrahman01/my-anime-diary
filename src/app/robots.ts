import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/search', '/anime', '/login', '/signup'],
      disallow: ['/dashboard', '/profile', '/settings', '/diary', '/favorites'],
    },
    sitemap: 'https://myanimediary.com/sitemap.xml',
  }
}