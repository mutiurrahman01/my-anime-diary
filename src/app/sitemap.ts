import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: anime } = await supabase
    .from('anime')
    .select('slug, updated_at')
    .is('deleted_at', null)

  // Static pages (no login/signup in sitemap – they don't need indexing)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const animePages: MetadataRoute.Sitemap =
    anime?.map((a) => ({
      url: `${SITE_URL}/anime/${a.slug}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) || []

  return [...staticPages, ...animePages]
}