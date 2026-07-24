import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { BookOpen, CalendarDays, Heart, User } from "lucide-react"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { buttonVariants } from "@/components/ui/button"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"
import { getProfile } from "@/services/profile.service"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [profileResult, watchedResponse, favoriteResponse, episodeResponse] =
    await Promise.all([
      getProfile(user.id),
      supabase
        .from("user_anime")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("user_anime")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("favorite", true),
      supabase
        .from("user_anime")
        .select("episodes_watched")
        .eq("user_id", user.id),
    ])

  const profile = profileResult.data
  if (!profile) {
    redirect("/login")
  }
  const watchedCount = watchedResponse.count ?? 0
  const favoriteCount = favoriteResponse.count ?? 0
  const episodesWatched = (episodeResponse.data ?? []).reduce((total, item) => {
    return total + (item.episodes_watched ?? 0)
  }, 0)
  const displayName =
    profile.display_name?.trim() ||
    profile.username?.trim() ||
    user.email?.split("@")[0] ||
    "Anime fan"
  const joinDate = profile?.created_at ?? user.created_at
  const joinLabel = joinDate ? formatDate(joinDate) : "Unknown"
  const hasDiaryData = watchedCount > 0
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Container className="space-y-8 py-8">
      <PageHeader
        title="Profile"
        description="Your private account details and diary statistics."
      />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border bg-muted">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="112px"
                />
              ) : (
                <span className="text-2xl font-semibold text-muted-foreground">
                  {initials || <User className="h-10 w-10" />}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="w-full space-y-3 rounded-2xl border bg-muted/30 p-4 text-left text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Username</span>
                <span className="font-medium text-foreground">{profile?.username ?? "Not set"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Email</span>
                <span className="max-w-[180px] truncate font-medium text-foreground">
                  {user.email ?? "Not available"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium text-foreground">{joinLabel}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <ProfileEditForm profile={profile} initials={initials} />
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Anime watched"
              value={watchedCount}
              description="Diaries added to your collection."
            />
            <StatCard
              label="Favorites"
              value={favoriteCount}
              description="Titles marked as personal favorites."
            />
            <StatCard
              label="Episodes watched"
              value={episodesWatched}
              description="Episodes recorded across your diary."
            />
          </section>

          {hasDiaryData ? (
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Active since {joinLabel}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                You have a growing private anime archive with {watchedCount} entries,
                {favoriteCount > 0 ? ` ${favoriteCount} favorites,` : ""} and {episodesWatched} total episodes tracked.
              </p>
            </section>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Your diary is empty"
              description="Add your first anime from search to start collecting private stats."
              action={
                <Link href="/search" className={cn(buttonVariants())}>
                  Browse anime
                </Link>
              }
            />
          )}

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Heart className="h-4 w-4" />
              Private account overview
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This profile is private to you. Use settings to change your email,
              update your password, or delete your account.
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
}
