import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import {
  CalendarClock,
  Heart,
  LibraryBig,
  Plus,
  Sparkles,
} from "lucide-react"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

type DashboardRecentActivity = {
  id: string
  rating: number | null
  favorite: boolean | null
  watch_status: string
  episodes_watched: number | null
  updated_at: string
  anime: {
    id: string
    title: string
    slug: string
    cover_image: string | null
    release_year: number | null
  } | null
}

type DashboardRecentActivityRow = Omit<DashboardRecentActivity, "anime"> & {
  anime: DashboardRecentActivity["anime"][] | DashboardRecentActivity["anime"] | null
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [profileResponse, watchedResponse, favoriteResponse, activityResponse] =
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
        .select(
          `
            id,
            rating,
            favorite,
            watch_status,
            episodes_watched,
            updated_at,
            anime:anime_id (
              id,
              title,
              slug,
              cover_image,
              release_year
            )
          `
        )
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(6),
    ])

  const profile = profileResponse.data
  const recentActivity = (activityResponse.data ?? []).map((item) => {
    const typedItem = item as DashboardRecentActivityRow
    const animeRelation = typedItem.anime

    return {
      ...item,
      anime: Array.isArray(animeRelation)
        ? animeRelation[0] ?? null
        : animeRelation ?? null,
    }
  }) as DashboardRecentActivity[]

  const episodesWatched = recentActivity.reduce((total, item) => {
    return total + (item.episodes_watched ?? 0)
  }, 0)

  const watchedCount = watchedResponse.count ?? 0
  const favoriteCount = favoriteResponse.count ?? 0
  const displayName =
    profile?.username?.trim() || user.email?.split("@")[0] || "Anime fan"

  return (
    <Container className="space-y-10 py-8 md:py-12">
      <PageHeader
        title={`Welcome back, ${displayName}`}
        description="Your private diary, statistics, and latest activity are shown below."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/search" className={buttonVariants({ variant: "outline" })}>
              Search anime
            </Link>
            <Link href="/diary" className={buttonVariants({})}>
              <Plus className="h-4 w-4" />
              Add to diary
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Anime watched"
          value={watchedCount}
          description="Entries stored in your private diary."
        />
        <StatCard
          label="Favorites"
          value={favoriteCount}
          description="Anime marked as personal favorites."
        />
        <StatCard
          label="Episodes watched"
          value={episodesWatched}
          description="Total episodes recorded across your diary."
        />
      </section>

      <section className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
        <SectionHeader
          title="Recent activity"
          action={
            <Link href="/diary" className={cn(buttonVariants({ variant: "ghost" }))}>
              View diary
            </Link>
          }
        />

        {recentActivity.length === 0 ? (
          <EmptyState
            icon={LibraryBig}
            title="No diary activity yet"
            description="Add an anime from search to start building your private history."
            action={
              <Link href="/search" className={buttonVariants()}>
                Browse anime
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border bg-background p-4 sm:flex-row sm:items-center"
              >
                <div className="relative flex h-20 w-14 overflow-hidden rounded-lg bg-muted">
                  {item.anime?.cover_image ? (
                    <Image
                      src={item.anime.cover_image}
                      alt={item.anime.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/anime/${item.anime?.slug ?? ""}`}
                    className="line-clamp-1 text-base font-semibold hover:text-primary"
                  >
                    {item.anime?.title ?? "Unknown anime"}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.watch_status.replaceAll("_", " ").toLowerCase()}
                    {item.anime?.release_year ? ` · ${item.anime.release_year}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full border bg-muted px-3 py-1 text-muted-foreground">
                    Updated {formatDate(item.updated_at)}
                  </span>
                  {item.rating !== null && (
                    <span className="rounded-full border bg-muted px-3 py-1 text-muted-foreground">
                      Rating {item.rating}/10
                    </span>
                  )}
                  {item.favorite && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                      <Heart className="h-3.5 w-3.5" />
                      Favorite
                    </span>
                  )}
                  {(item.episodes_watched ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {item.episodes_watched} episodes
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="Latest anime in your diary"
          action={
            <Link href="/favorites" className={cn(buttonVariants({ variant: "ghost" }))}>
              View favorites
            </Link>
          }
        />
        {recentActivity.length === 0 ? (
          <EmptyState
            icon={LibraryBig}
            title="Nothing to show yet"
            description="Your latest diary entries will appear here once you start adding anime."
          />
        ) : (
          <AnimeGrid>
            {recentActivity.slice(0, 6).map((activity) => {
              if (!activity.anime) {
                return null
              }

              return (
                <AnimeCard
                  key={activity.id}
                  title={activity.anime.title}
                  slug={activity.anime.slug}
                  coverImage={activity.anime.cover_image ?? undefined}
                  releaseYear={activity.anime.release_year ?? undefined}
                  rating={activity.rating ?? undefined}
                />
              )
            })}
          </AnimeGrid>
        )}
      </section>
    </Container>
  )
}