import type { SupabaseClient } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import type { Database, UserAnimeInsert, UserAnimeRow, UserAnimeUpdate, WatchStatus } from "@/types/database"

export type DiaryEntryInput = {
  userId: string
  animeId: string
  watchStatus: WatchStatus
  episodesWatched?: number | null
  rating?: number | null
  favorite?: boolean | null
  notes?: string | null
}

export type DiaryEntryResult = {
  data: UserAnimeRow | null
  error: string | null
}

function mapServiceError(error: { message: string } | null): string | null {
  if (!error) {
    return null
  }

  return "We couldn't update your diary right now. Please try again."
}

export async function getUserAnime(userId: string): Promise<{ data: UserAnimeRow[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("user_anime")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    return {
      data: (data ?? []) as UserAnimeRow[],
      error: mapServiceError(error),
    }
  } catch {
    return {
      data: [],
      error: "Unable to load your diary right now.",
    }
  }
}

export async function getDiaryEntry(userId: string, animeId: string): Promise<DiaryEntryResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("user_anime")
      .select("*")
      .eq("user_id", userId)
      .eq("anime_id", animeId)
      .maybeSingle()

    return {
      data: (data as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch {
    return {
      data: null,
      error: "Unable to load your diary right now.",
    }
  }
}

export async function addToDiary(data: DiaryEntryInput): Promise<DiaryEntryResult> {
  try {
    const supabase = await createClient()
    const payload: UserAnimeInsert = {
      user_id: data.userId,
      anime_id: data.animeId,
      watch_status: data.watchStatus,
      episodes_watched: data.episodesWatched ?? null,
      rating: data.rating ?? null,
      favorite: data.favorite ?? false,
      notes: data.notes ?? null,
    }

    const { data: inserted, error } = await supabase
      .from("user_anime")
      .insert(payload)
      .select("*")
      .single()

    return {
      data: (inserted as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch {
    return {
      data: null,
      error: "Unable to update your diary right now.",
    }
  }
}

export async function updateDiary(id: string, data: Partial<DiaryEntryInput>): Promise<DiaryEntryResult> {
  try {
    const supabase = await createClient()
    const payload: UserAnimeUpdate = {
      watch_status: data.watchStatus,
      episodes_watched: data.episodesWatched ?? null,
      rating: data.rating ?? null,
      favorite: data.favorite ?? false,
      notes: data.notes ?? null,
    }

    const { data: updated, error } = await supabase
      .from("user_anime")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single()

    return {
      data: (updated as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch {
    return {
      data: null,
      error: "Unable to update your diary right now.",
    }
  }
}

export async function toggleFavorite(id: string): Promise<DiaryEntryResult> {
  try {
    const supabase = await createClient()
    const { data: current, error: fetchError } = await supabase
      .from("user_anime")
      .select("favorite")
      .eq("id", id)
      .maybeSingle()

    if (fetchError) {
      return {
        data: null,
        error: mapServiceError(fetchError),
      }
    }

    const nextFavorite = !(current?.favorite ?? false)
    const { data: updated, error } = await supabase
      .from("user_anime")
      .update({ favorite: nextFavorite })
      .eq("id", id)
      .select("*")
      .single()

    return {
      data: (updated as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch {
    return {
      data: null,
      error: "Unable to update your diary right now.",
    }
  }
}

export async function deleteDiaryEntry(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("user_anime").delete().eq("id", id)

    return {
      error: mapServiceError(error),
    }
  } catch {
    return {
      error: "Unable to update your diary right now.",
    }
  }
}
