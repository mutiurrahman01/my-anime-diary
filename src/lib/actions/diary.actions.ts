"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import type { WatchStatus } from "@/types/database"
import {
  addToDiary,
  deleteDiaryEntry,
  getDiaryEntry,
  toggleFavorite,
  updateDiary,
} from "@/services/user-anime.service"

export type DiaryActionState = {
  error: string | null
  message: string | null
}

const emptyState: DiaryActionState = {
  error: null,
  message: null,
}

function getString(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function getOptionalNumber(formData: FormData, name: string): number | null {
  const value = formData.get(name)
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? Number(trimmed) : null
}

function getOptionalBoolean(formData: FormData, name: string): boolean | null {
  const value = formData.get(name)
  return value === "on"
}

function getWatchStatus(value: string): WatchStatus {
  if (value === "WATCHING" || value === "COMPLETED" || value === "ON_HOLD" || value === "DROPPED" || value === "PLAN_TO_WATCH") {
    return value
  }

  return "PLAN_TO_WATCH"
}

export async function addToDiaryAction(
  _previousState: DiaryActionState,
  formData: FormData
): Promise<DiaryActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const animeId = getString(formData, "animeId")
  const watchStatus = getWatchStatus(getString(formData, "watchStatus"))
  const episodesWatched = getOptionalNumber(formData, "episodesWatched")
  const rating = getOptionalNumber(formData, "rating")
  const favorite = getOptionalBoolean(formData, "favorite")
  const notes = getString(formData, "notes")

  if (!animeId) {
    return {
      ...emptyState,
      error: "Anime details were not found.",
    }
  }

  const existing = await getDiaryEntry(user.id, animeId)
  if (existing.error) {
    return {
      ...emptyState,
      error: existing.error,
    }
  }

  if (existing.data) {
    return {
      ...emptyState,
      error: "This anime is already in your diary.",
    }
  }

  const result = await addToDiary({
    userId: user.id,
    animeId,
    watchStatus,
    episodesWatched,
    rating: rating ? Math.max(1, Math.min(10, rating)) : null,
    favorite,
    notes: notes || null,
  })

  if (result.error) {
    return {
      ...emptyState,
      error: result.error,
    }
  }

  return {
    ...emptyState,
    message: "Added to your diary.",
  }
}

export async function updateDiaryAction(
  _previousState: DiaryActionState,
  formData: FormData
): Promise<DiaryActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const entryId = getString(formData, "entryId")
  const watchStatus = getWatchStatus(getString(formData, "watchStatus"))
  const episodesWatched = getOptionalNumber(formData, "episodesWatched")
  const rating = getOptionalNumber(formData, "rating")
  const favorite = getOptionalBoolean(formData, "favorite")
  const notes = getString(formData, "notes")

  if (!entryId) {
    return {
      ...emptyState,
      error: "Diary entry was not found.",
    }
  }

  const result = await updateDiary(entryId, {
    watchStatus,
    episodesWatched,
    rating: rating ? Math.max(1, Math.min(10, rating)) : null,
    favorite,
    notes: notes || null,
  })

  if (result.error) {
    return {
      ...emptyState,
      error: result.error,
    }
  }

  return {
    ...emptyState,
    message: "Entry updated.",
  }
}

export async function deleteDiaryEntryAction(_previousState: DiaryActionState, formData: FormData) {
  const entryId = getString(formData, "entryId")

  if (!entryId) {
    return {
      ...emptyState,
      error: "No diary entry was selected.",
    }
  }

  const result = await deleteDiaryEntry(entryId)

  if (result.error) {
    return {
      ...emptyState,
      error: result.error,
    }
  }

  return {
    ...emptyState,
    message: "Entry removed from your diary.",
  }
}

export async function toggleFavoriteAction(_previousState: DiaryActionState, formData: FormData) {
  const entryId = getString(formData, "entryId")

  if (!entryId) {
    return {
      ...emptyState,
      error: "No diary entry was selected.",
    }
  }

  const result = await toggleFavorite(entryId)

  if (result.error) {
    return {
      ...emptyState,
      error: result.error,
    }
  }

  revalidatePath("/favorites")
  revalidatePath("/dashboard")
  revalidatePath("/diary")

  return {
    ...emptyState,
    message: "Favorite status updated.",
  }
}
