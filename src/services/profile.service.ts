
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

    if (error && process.env.NODE_ENV === "development") {
      console.error("🔴 getProfile Supabase error:", JSON.stringify(error, null, 2))
    }

    return {
      data: (data as ProfileRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("🔴 getProfile caught error:", error)
    }
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

    if (error && process.env.NODE_ENV === "development") {
      console.error("🔴 checkUsernameAvailability Supabase error:", JSON.stringify(error, null, 2))
    }
    return {
      available: !data,
      error: mapServiceError(error),
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("🔴 checkUsernameAvailability caught error:", error)
    }
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

    if (error && process.env.NODE_ENV === "development") {
      console.error("🔴 updateProfile Supabase error:", JSON.stringify(error, null, 2))
    }

    return {
      data: (data as ProfileRow | null) ?? null,
      error: mapServiceError(error),
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("🔴 updateProfile caught error:", error)
    }
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unable to update your profile.",
    }
  }
}

async function deleteOldAvatar(
  userId: string,
  oldAvatarUrl: string | null
): Promise<void> {
  if (!oldAvatarUrl) {
    return
  }

  try {
    const supabase = await createClient()

    // Extract file path from public URL
    const url = new URL(oldAvatarUrl)
    const pathParts = url.pathname.split("/")
    // Find the index of "avatars" in the path to get the file path after it
    const avatarsIndex = pathParts.indexOf("avatars")
    if (avatarsIndex === -1 || avatarsIndex === pathParts.length - 1) {
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Could not extract file path from avatar URL:", oldAvatarUrl)
      }
      return
    }
    const oldFilePath = pathParts.slice(avatarsIndex + 1).join("/")

    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([oldFilePath])

    if (deleteError && process.env.NODE_ENV === "development") {
      console.error("🔴 deleteOldAvatar error:", JSON.stringify(deleteError, null, 2))
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("🔴 deleteOldAvatar caught error:", error)
    }
  }
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient()
    // First get current profile to get old avatar URL
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .maybeSingle()

    // Delete old avatar if exists
    await deleteOldAvatar(userId, currentProfile?.avatar_url)

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError && process.env.NODE_ENV === "development") {
      console.error("🔴 uploadAvatar Supabase upload error:", JSON.stringify(uploadError, null, 2))
    }

    if (uploadError) {
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
    if (process.env.NODE_ENV === "development") {
      console.error("🔴 uploadAvatar caught error:", error)
    }
    return {
      url: null,
      error: error instanceof Error ? error.message : "Unable to upload your avatar.",
    }
  }
}

