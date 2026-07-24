"use client"

import React, { useRef, useState } from "react"
import { ImagePlus, Loader2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileRow } from "@/services/profile.service"
import { updateProfileAction, uploadAvatarAction } from "@/lib/actions/profile.actions"

type ProfileEditFormProps = {
  profile: ProfileRow
  initials: string
}

export function ProfileEditForm({ profile, initials }: ProfileEditFormProps) {
  const [profileState, profileAction, profilePending] = React.useActionState(
    updateProfileAction,
    { error: null, message: null }
  )
  const [avatarState, avatarAction, avatarPending] = React.useActionState(
    uploadAvatarAction,
    { error: null, message: null }
  )
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar_url
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  return (
    <section className="space-y-8 rounded-2xl border bg-card p-6 shadow-sm">
      {/* Success/Error Messages */}
      {profileState.message && (
        <div className="rounded-lg border bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {profileState.message}
        </div>
      )}
      {profileState.error && (
        <div className="rounded-lg border bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {profileState.error}
        </div>
      )}
      {avatarState.message && (
        <div className="rounded-lg border bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {avatarState.message}
        </div>
      )}
      {avatarState.error && (
        <div className="rounded-lg border bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {avatarState.error}
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your public profile information.
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-muted-foreground">
                {initials || <User className="h-10 w-10" />}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <ImagePlus className="h-4 w-4" />
              Change Avatar
            </Button>
            {avatarPreview && (
              <form action={avatarAction} className="space-y-2">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    if (el) {
                      el.files = fileInputRef.current?.files || null
                    }
                  }}
                  readOnly
                />
                <Button
                  type="submit"
                  disabled={avatarPending}
                  className="flex items-center gap-2"
                >
                  {avatarPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Upload Avatar
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form action={profileAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              defaultValue={profile.username || ""}
              placeholder="Enter username"
            />
            <p className="text-xs text-muted-foreground">
              Only letters, numbers, and underscores allowed.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={profile.display_name || ""}
              placeholder="Enter display name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio || ""}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <Input
            id="website"
            name="website"
            defaultValue={profile.website || ""}
            placeholder="https://example.com"
          />
        </div>

        <Button
          type="submit"
          disabled={profilePending}
          className="flex items-center gap-2"
        >
          {profilePending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </section>
  )
}
