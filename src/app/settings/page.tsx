import Link from "next/link"
import { redirect } from "next/navigation"
import { CalendarDays, ShieldCheck, User } from "lucide-react"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { AccountSettingsDialogs } from "@/components/settings/account-settings-dialogs"
import { createClient } from "@/lib/supabase/server"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [profileResponse, watchedResponse, favoriteResponse, episodesResponse] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("username, created_at")
        .eq("id", user.id)
        .maybeSingle(),
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

  const profile = profileResponse.data
  const watchedCount = watchedResponse.count ?? 0
  const favoriteCount = favoriteResponse.count ?? 0
  const episodesWatched = (episodesResponse.data ?? []).reduce((total, item) => {
    return total + (item.episodes_watched ?? 0)
  }, 0)
  const displayName =
    profile?.username?.trim() || user.email?.split("@")[0] || "Anime fan"
  const joinedLabel = profile?.created_at ? formatDate(profile.created_at) : "Unknown"

  return (
    <Container className="space-y-8 py-8">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and security."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Username"
          value={displayName}
          description={profile?.username ? "Profile name synced from Supabase." : "No username saved yet."}
        />
        <StatCard
          label="Joined"
          value={joinedLabel}
          description={user.email ?? "Email unavailable"}
        />
        <StatCard
          label="Diary summary"
          value={`${watchedCount} / ${favoriteCount}`}
          description={`${episodesWatched} total episodes tracked`}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-sm text-muted-foreground">
              Update your email, password, or delete your account with the dialogs below.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border bg-muted/20 p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="max-w-[220px] truncate font-medium">{user.email ?? "Not available"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium">{profile?.username ?? "Not set"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Join date</span>
              <span className="font-medium">{joinedLabel}</span>
            </div>
          </div>

          <AccountSettingsDialogs email={user.email ?? ""} />
        </section>

        <aside className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Security notes
          </div>
          <ul className="space-y-4 text-sm leading-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Your profile information is private and only visible to you.
            </li>
            <li className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Changing your email will trigger a confirmation message to the new address.
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Deleting your account removes the Supabase auth user and diary data.
            </li>
          </ul>
          <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
            Keep your password unique and rotate it whenever you suspect account access issues.
          </div>
        </aside>
      </div>
    </Container>
  )
}
