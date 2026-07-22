"use server"

import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export type FormState = {
  error: string | null
  message: string | null
}

const emptyState: FormState = {
  error: null,
  message: null,
}

function getField(formData: FormData, name: string) {
  const value = formData.get(name)

  return typeof value === "string" ? value.trim() : ""
}

export async function logoutAction() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  redirect("/")
}

export async function updateEmailAction(
  _previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = getField(formData, "email")

  if (!email || !email.includes("@")) {
    return {
      ...emptyState,
      error: "Enter a valid email address.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ email })

  if (error) {
    return {
      ...emptyState,
      error: error.message,
    }
  }

  return {
    ...emptyState,
    message: "Check your inbox to confirm the new email address.",
  }
}

export async function updatePasswordAction(
  _previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const password = getField(formData, "password")
  const confirmPassword = getField(formData, "confirmPassword")

  if (password.length < 8) {
    return {
      ...emptyState,
      error: "Password must be at least 8 characters.",
    }
  }

  if (password !== confirmPassword) {
    return {
      ...emptyState,
      error: "Passwords do not match.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return {
      ...emptyState,
      error: error.message,
    }
  }

  return {
    ...emptyState,
    message: "Your password has been updated.",
  }
}

export async function deleteAccountAction(
  _previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const confirmation = getField(formData, "confirmation")

  if (confirmation !== "DELETE") {
    return {
      ...emptyState,
      error: 'Type DELETE to confirm account deletion.',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ...emptyState,
      error: "No authenticated user was found.",
    }
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(user.id)

  if (error) {
    return {
      ...emptyState,
      error: error.message,
    }
  }

  try {
    await supabase.auth.signOut()
  } catch {
    // Best-effort cleanup. The account has already been deleted.
  }

  redirect("/")
}