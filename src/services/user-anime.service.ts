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

export type DiaryEntryWithAnime = UserAnimeRow & {
  anime: {
    id: string
    title: string
    slug: string
    cover_image: string | null
    release_year: number | null
  } | null
}

export type DiarySortBy =
  | "updated_at"
  | "rating"
  | "episodes_watched"
  | "title"

function normalizeAnimeRelation(entry: any): DiaryEntryWithAnime {
  let anime = null

  if (entry?.anime) {
    anime = Array.isArray(entry.anime) ? entry.anime[0] ?? null : entry.anime
  }

  return {
    ...entry,
    anime,
  }
}

function sortDiaryEntries(entries: DiaryEntryWithAnime[], sortBy: DiarySortBy) {
  return [...entries].sort((a, b) => {
    if (sortBy === "title") {
      return (a.anime?.title ?? "").localeCompare(b.anime?.title ?? "")
    }

    if (sortBy === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0)
    }

    if (sortBy === "episodes_watched") {
      return (b.episodes_watched ?? 0) - (a.episodes_watched ?? 0)
    }

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })
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

    if (error && process.env.NODE_ENV === "development") {
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

    if (error && process.env.NODE_ENV === "development") {
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

export async function getUserDiaryEntries(
  userId: string,
  sortBy: DiarySortBy = "updated_at"
): Promise<{ data: DiaryEntryWithAnime[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const selectQuery = `
          *,
          anime:anime_id (
            id,
            title,
            slug,
            cover_image,
            release_year
          )
        `

    const request = supabase.from("user_anime").select(selectQuery).eq("user_id", userId)

    const orderedRequest = sortBy === "title"
      ? request.order("anime.title", { ascending: true, nullsFirst: true })
      : request.order(sortBy, { ascending: false, nullsFirst: false })

    const { data, error } = await orderedRequest

    if (error && process.env.NODE_ENV === "development") {
      console.error("🔴 getUserDiaryEntries Supabase error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
    }

    const entries = (data ?? []).map(normalizeAnimeRelation) as DiaryEntryWithAnime[]

    return {
      data: sortDiaryEntries(entries, sortBy),
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 getUserDiaryEntries caught error:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unable to load your diary right now.",
    }
  }
}

export async function getUserFavorites(
  userId: string
): Promise<{ data: DiaryEntryWithAnime[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const selectQuery = `
          *,
          anime:anime_id (
            id,
            title,
            slug,
            cover_image,
            release_year
          )
        `

    const { data, error } = await supabase
      .from("user_anime")
      .select(selectQuery)
      .eq("user_id", userId)
      .eq("favorite", true)
      .order("updated_at", { ascending: false })

    if (error && process.env.NODE_ENV === "development") {
      console.error("🔴 getUserFavorites Supabase error:", JSON.stringify(error, null, 2))
      console.error("🔴 Error code:", (error as any)?.code)
      console.error("🔴 Error message:", error.message)
      console.error("🔴 Error details:", (error as any)?.details)
      console.error("🔴 Error hint:", (error as any)?.hint)
    }

    const entries = (data ?? []).map(normalizeAnimeRelation) as DiaryEntryWithAnime[]

    return {
      data: entries,
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 getUserFavorites caught error:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unable to load your favorites right now.",
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

    if (process.env.NODE_ENV === "development") {
      console.error("🔷 addToDiary payload:", JSON.stringify(payload, null, 2))
    }

    const { data: inserted, error } = await supabase
      .from("user_anime")
      .insert(payload)
      .select("*")
      .single()

    if (process.env.NODE_ENV === "development") {
      console.error("🔷 addToDiary returned:", JSON.stringify({ data: inserted ?? null, error }, null, 2))
    }

    if (error && process.env.NODE_ENV === "development") {
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

    if (error && process.env.NODE_ENV === "development") {
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
      if (process.env.NODE_ENV === "development") {
        console.error("🔴 toggleFavorite fetch error:", JSON.stringify(fetchError, null, 2))
        console.error("🔴 Error code:", (fetchError as any)?.code)
        console.error("🔴 Error message:", fetchError.message)
        console.error("🔴 Error details:", (fetchError as any)?.details)
        console.error("🔴 Error hint:", (fetchError as any)?.hint)
      }
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

    if (error && process.env.NODE_ENV === "development") {
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

    if (error && process.env.NODE_ENV === "development") {
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
