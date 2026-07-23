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

  return error.message
}

export async function getUserAnime(userId: string): Promise<{ data: UserAnimeRow[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("user_anime")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("🔴 getUserAnime Supabase error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
    }

    return {
      data: (data ?? []) as UserAnimeRow[],
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 getUserAnime caught error:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unable to load your diary right now.",
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

    if (error) {
      console.error("🔴 getDiaryEntry Supabase error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
    }

    return {
      data: (data as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 getDiaryEntry caught error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unable to load your diary right now.",
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

    console.error("🔷 addToDiary payload:", JSON.stringify(payload, null, 2))

    const { data: inserted, error } = await supabase
      .from("user_anime")
      .insert(payload)
      .select("*")
      .single()

    console.error("🔷 addToDiary returned:", JSON.stringify({ data: inserted ?? null, error }, null, 2))

    if (error) {
      console.error("🔴 Full Supabase error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
      console.error("🔴 addToDiary failed query: insert into user_anime", payload)
    }

    return {
      data: (inserted as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 addToDiary caught error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : error instanceof Object ? JSON.stringify(error) : "Unable to update your diary right now.",
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

    if (error) {
      console.error("🔴 updateDiary Supabase error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
    }

    return {
      data: (updated as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 updateDiary caught error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : error instanceof Object ? JSON.stringify(error) : "Unable to update your diary right now.",
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
      console.error("🔴 toggleFavorite fetch error:", JSON.stringify(fetchError, null, 2))
      console.error("🔴 Error code:", (fetchError as any)?.code)
      console.error("🔴 Error message:", fetchError.message)
      console.error("🔴 Error details:", (fetchError as any)?.details)
      console.error("🔴 Error hint:", (fetchError as any)?.hint)
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

    if (error) {
      console.error("🔴 toggleFavorite update error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
    }

    return {
      data: (updated as UserAnimeRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 toggleFavorite caught error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : error instanceof Object ? JSON.stringify(error) : "Unable to update your diary right now.",
    }
  }
}

export async function deleteDiaryEntry(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("user_anime").delete().eq("id", id)

    if (error) {
      console.error("🔴 deleteDiaryEntry Supabase error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
    }

    return {
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 deleteDiaryEntry caught error:", error)
    return {
      error: error instanceof Error ? error.message : error instanceof Object ? JSON.stringify(error) : "Unable to update your diary right now.",
    }
  }
}
