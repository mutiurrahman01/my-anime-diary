import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: anime } = await supabase
    .from('anime')
    .select('slug, updated_at')
    .is('deleted_at', null)

  const staticPages = [
    { url: 'https://myanimediary.com', lastModified: new Date() },
    { url: 'https://myanimediary.com/search', lastModified: new Date() },
    { url: 'https://myanimediary.com/login', lastModified: new Date() },
    { url: 'https://myanimediary.com/signup', lastModified: new Date() },
  ]

  const animePages =
    anime?.map((a) => ({
      url: `https://myanimediary.com/anime/${a.slug}`,
      lastModified: new Date(a.updated_at),
    })) || []

  return [...staticPages, ...animePages]
}