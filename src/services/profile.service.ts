

import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type ProfileResult = {
  data: ProfileRow | null
  error: string | null
}

function mapServiceError(error: { message: string } | null): string | null {
  if (!error) {
    return null
  }
  return error.message
}

export async function getProfile(userId: string): Promise<ProfileResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (error) {
      console.error("🔴 getProfile Supabase error:", JSON.stringify(error, null, 2))
    }

    return {
      data: (data as ProfileRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 getProfile caught error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unable to load your profile.",
    }
  }
}

export async function checkUsernameAvailability(
  username: string,
  excludeUserId: string
): Promise<{ available: boolean; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", excludeUserId)
      .maybeSingle()

    if (error) {
      console.error("🔴 checkUsernameAvailability Supabase error:", JSON.stringify(error, null, 2))
      return {
        available: false,
        error: mapServiceError(error),
      }
    }

    return {
      available: !data,
      error: null,
    }
  } catch (error) {
    console.error("🔴 checkUsernameAvailability caught error:", error)
    return {
      available: false,
      error: error instanceof Error ? error.message : "Unable to check username availability.",
    }
  }
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<ProfileResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select("*")
      .single()

    if (error) {
      console.error("🔴 updateProfile Supabase error:", JSON.stringify(error, null, 2))
    }

    return {
      data: (data as ProfileRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    console.error("🔴 updateProfile caught error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unable to update your profile.",
    }
  }
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const fileExt = file.name.split(".").pop()
    const filePath = `${userId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("🔴 uploadAvatar Supabase upload error:", JSON.stringify(uploadError, null, 2))
      return {
        url: null,
        error: mapServiceError(uploadError),
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      error: null,
    }
  } catch (error) {
    console.error("🔴 uploadAvatar caught error:", error)
    return {
      url: null,
      error: error instanceof Error ? error.message : "Unable to upload your avatar.",
    }
  }
}
