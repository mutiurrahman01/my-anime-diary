import type { AnimeListItem } from "@/types/database"
import { createClient } from "@/lib/supabase/server"

function mapSearchError(error: { message: string } | null): string | null {
  if (!error) {
    return null
  }

  return "Unable to search anime right now. Please try again."
}

export async function getRecentAnime(
  limit: number = 12
): Promise<{ data: AnimeListItem[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("anime")
      .select("id, mal_id, title, english_title, slug, cover_image, release_year, score")
      .is("deleted_at", null)
      .order("created_at", { ascending: false, nullsFirst: false })
      .limit(limit)

    return {
      data: (data ?? []) as AnimeListItem[],
      error: mapSearchError(error),
    }
  } catch (error) {
    return {
      data: [],
      error: "Unable to fetch recent anime right now. Please try again later.",
    }
  }
}

export async function getHighestRatedAnime(
  limit: number = 12
): Promise<{ data: AnimeListItem[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("anime")
      .select("id, mal_id, title, english_title, slug, cover_image, release_year, score")
      .is("deleted_at", null)
      .not("score", "is", null)
      .order("score", { ascending: false, nullsFirst: false })
      .limit(limit)

    return {
      data: (data ?? []) as AnimeListItem[],
      error: mapSearchError(error),
    }
  } catch (error) {
    return {
      data: [],
      error: "Unable to fetch highest rated anime right now. Please try again later.",
    }
  }
}
