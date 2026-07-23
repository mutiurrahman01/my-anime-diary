import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpen } from "lucide-react"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/shared/page-header"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { EmptyState } from "@/components/shared/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { getUserDiaryEntries, type DiarySortBy } from "@/services/user-anime.service"

const sortOptions: { value: DiarySortBy; label: string }[] = [
  { value: "updated_at", label: "Recently updated" },
  { value: "rating", label: "Rating" },
  { value: "episodes_watched", label: "Episodes watched" },
  { value: "title", label: "Title" },
]

function getSortOption(value?: string): DiarySortBy {
  if (value && sortOptions.some((option) => option.value === value)) {
    return value as DiarySortBy
  }

  return "updated_at"
}

export default async function DiaryPage({
  searchParams,
}: {
  searchParams?: { sort?: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const sortBy = getSortOption(searchParams?.sort)
  const diaryResponse = await getUserDiaryEntries(user.id, sortBy)
  const diaryEntries = diaryResponse.data

  return (
    <Container className="space-y-8 py-8">
      <PageHeader
        title="My Diary"
        description="A complete record of the anime you have watched."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/search" className={buttonVariants({ variant: "outline" })}>
              Search anime
            </Link>
          </div>
        }
      />

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Sort diary</h2>
            <p className="text-sm text-muted-foreground">
              Choose how your diary entries are ordered.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={`/diary?sort=${option.value}`}
                className={buttonVariants({
                  variant: sortBy === option.value ? "default" : "outline",
                  size: "sm",
                })}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {diaryResponse.error ? (
          <EmptyState
            icon={BookOpen}
            title="Unable to load diary"
            description="Something went wrong fetching your diary entries. Please try again later."
            action={
              <Link href="/search" className={buttonVariants()}>
                Browse anime
              </Link>
            }
          />
        ) : diaryEntries.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Your diary is empty"
            description="Add an anime from search to begin tracking your private collection."
            action={
              <Link href="/search" className={buttonVariants()}>
                Browse anime
              </Link>
            }
          />
        ) : (
          <AnimeGrid>
            {diaryEntries.map((entry) => (
              <AnimeCard
                key={entry.id}
                title={entry.anime?.title ?? "Unknown anime"}
                releaseYear={entry.anime?.release_year ?? undefined}
                coverImage={entry.anime?.cover_image ?? undefined}
                rating={entry.rating ?? undefined}
                slug={entry.anime?.slug ?? undefined}
              />
            ))}
          </AnimeGrid>
        )}
      </section>
    </Container>
  )
}
