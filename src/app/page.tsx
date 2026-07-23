import Link from "next/link"
import { Search } from "lucide-react"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { SectionHeader } from "@/components/shared/section-header"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import { getRecentAnime, getHighestRatedAnime } from "@/services/anime.service.server"

export default async function Home() {
  const [recentAnimeResponse, highestRatedResponse] = await Promise.all([
    getRecentAnime(12),
    getHighestRatedAnime(12),
  ])

  const recentAnime = recentAnimeResponse.data
  const highestRatedAnime = highestRatedResponse.data
  const hasError = recentAnimeResponse.error || highestRatedResponse.error

  return (
    <Container className="py-12 md:py-24 space-y-16">
      <section className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-primary">
          Your Private Anime Diary
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Track what you watch, rate your favorites, and keep a personal journal of your anime journey.
        </p>
        <div className="flex gap-4">
          <Link href="/search" className={buttonVariants({ size: "lg" })}>
            Get Started
          </Link>
          <Link href="/search" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Search Anime
          </Link>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Recent Additions"
          action={
            <Link href="/search" className={cn(buttonVariants({ variant: "ghost" }))}>
              View All
            </Link>
          }
        />
        {hasError ? (
          <EmptyState
            icon={Search}
            title="Unable to load anime"
            description="Something went wrong fetching the anime. Please try again later."
            action={
              <Link href="/search" className={buttonVariants()}>
                Search Anime
              </Link>
            }
          />
        ) : recentAnime.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No anime available yet"
            description="Check back soon for new additions!"
          />
        ) : (
          <AnimeGrid>
            {recentAnime.map((anime) => (
              <AnimeCard
                key={anime.id}
                title={anime.title}
                releaseYear={anime.release_year ?? undefined}
                coverImage={anime.cover_image ?? undefined}
                rating={anime.score ?? undefined}
                slug={anime.slug ?? undefined}
                malId={anime.mal_id ?? undefined}
              />
            ))}
          </AnimeGrid>
        )}
      </section>

      <section>
        <SectionHeader
          title="Highest Rated"
          action={
            <Link href="/search" className={cn(buttonVariants({ variant: "ghost" }))}>
              View All
            </Link>
          }
        />
        {hasError ? (
          <EmptyState
            icon={Search}
            title="Unable to load anime"
            description="Something went wrong fetching the anime. Please try again later."
            action={
              <Link href="/search" className={buttonVariants()}>
                Search Anime
              </Link>
            }
          />
        ) : highestRatedAnime.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No rated anime available yet"
            description="Check back soon for new additions!"
          />
        ) : (
          <AnimeGrid>
            {highestRatedAnime.map((anime) => (
              <AnimeCard
                key={anime.id}
                title={anime.title}
                releaseYear={anime.release_year ?? undefined}
                coverImage={anime.cover_image ?? undefined}
                rating={anime.score ?? undefined}
                slug={anime.slug ?? undefined}
                malId={anime.mal_id ?? undefined}
              />
            ))}
          </AnimeGrid>
        )}
      </section>
    </Container>
  )
}
