"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import {
  checkUsernameAvailability,
  updateProfile,
  uploadAvatar,
} from "@/services/profile.service"

export type ProfileActionState = {
  error: string | null
  message: string | null
}

const emptyState: ProfileActionState = {
  error: null,
  message: null,
}

function getString(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function getOptionalString(formData: FormData, name: string): string | null {
  const value = formData.get(name)
  if (typeof value !== "string" || value.trim() === "") {
    return null
  }
  return value.trim()
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const username = getString(formData, "username")
  const displayName = getOptionalString(formData, "displayName")
  const bio = getOptionalString(formData, "bio")
  const website = getOptionalString(formData, "website")

  // Username validation
  if (!username) {
    return { ...emptyState, error: "Username is required." }
  }

  if (username.length < 3) {
    return { ...emptyState, error: "Username must be at least 3 characters long." }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { ...emptyState, error: "Username can only contain letters, numbers, and underscores." }
  }

  // Website validation
  if (website && !isValidUrl(website)) {
    return { ...emptyState, error: "Website must be a valid URL." }
  }

  // Check username availability
  const availability = await checkUsernameAvailability(username, user.id)
  if (availability.error) {
    return { ...emptyState, error: availability.error }
  }
  if (!availability.available) {
    return { ...emptyState, error: "Username is already taken." }
  }

  // Update profile
  const result = await updateProfile(user.id, {
    username,
    display_name: displayName,
    bio,
    website: website ? (website.startsWith("http") ? website : `https://${website}`) : null,
  })

  if (result.error) {
    return { ...emptyState, error: result.error }
  }

  revalidatePath("/profile")
  revalidatePath("/settings")
  revalidatePath("/dashboard")

  return { ...emptyState, message: "Profile updated successfully!" }
}

export async function uploadAvatarAction(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const file = formData.get("avatar") as File | null

  if (!file || file.size === 0) {
    return { ...emptyState, error: "Please select an image file." }
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { ...emptyState, error: "Only image files are allowed." }
  }

  // Validate file size (5MB max
  if (file.size > 5 * 1024 * 1024) {
    return { ...emptyState, error: "Image file size must be less than 5MB." }
  }

  // Upload avatar
  const uploadResult = await uploadAvatar(user.id, file)
  if (uploadResult.error || !uploadResult.url) {
    return { ...emptyState, error: uploadResult.error || "Failed to upload avatar." }
  }

  // Update profile with new avatar URL
  const updateResult = await updateProfile(user.id, {
    avatar_url: uploadResult.url,
  })

  if (updateResult.error) {
    return { ...emptyState, error: updateResult.error }
  }

  revalidatePath("/profile")
  revalidatePath("/settings")
  revalidatePath("/dashboard")

  return { ...emptyState, message: "Avatar updated successfully!" }
}
