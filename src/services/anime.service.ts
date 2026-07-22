import type { SupabaseClient } from "@supabase/supabase-js"

import type { AnimeListItem, AnimeRow, Database } from "@/types/database"
import { quoteIlikePattern } from "@/utils/slug"

const DEFAULT_LIMIT = 24

export type AnimeSearchOptions = {
  limit?: number
}

export type AnimeSearchResponse = {
  data: AnimeListItem[]
  error: string | null
}

function mapSearchError(error: { message: string } | null): string | null {
  if (!error) {
    return null
  }

  return "Unable to search anime right now. Please try again."
}

export async function searchAnime(
  supabase: SupabaseClient<Database>,
  query: string,
  options: AnimeSearchOptions = {}
): Promise<AnimeSearchResponse> {
  const limit = options.limit ?? DEFAULT_LIMIT
  const trimmed = query.trim()

  let request = supabase
    .from("anime")
    .select("id, title, english_title, slug, cover_image, release_year, score")
    .is("deleted_at", null)
    .order("popularity", { ascending: true, nullsFirst: false })
    .limit(limit)

  if (trimmed) {
    const pattern = quoteIlikePattern(`%${trimmed}%`)
    request = request.or(
      `title.ilike.${pattern},english_title.ilike.${pattern},japanese_title.ilike.${pattern}`
    )
  }

  const { data, error } = await request

  return {
    data: (data ?? []) as AnimeListItem[],
    error: mapSearchError(error),
  }
}

export async function getAnimeBySlug(
  supabase: SupabaseClient<Database>,
  slug: string
): Promise<{ data: AnimeRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from("anime")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle()

  return {
    data: (data as AnimeRow | null) ?? null,
    error: mapSearchError(error),
  }
}
