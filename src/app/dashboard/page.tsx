import Link from "next/link"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { SectionHeader } from "@/components/shared/section-header"
import { SupabaseAnimePreview } from "@/components/shared/supabase-anime-preview"
import { cn } from "@/lib/utils"

const placeholderAnime = Array.from({ length: 10 }).map((_, i) => ({
  title: `Amazing Anime ${i + 1}`,
  releaseYear: 2024 - (i % 5),
  rating: (i % 10) + 1,
  slug: `amazing-anime-${i + 1}`,
}))

export default function DashboardPage() {
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
          <Link href="/diary" className={buttonVariants({ size: "lg" })}>
            Get Started
          </Link>
          <Link href="/search" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Search Anime
          </Link>
        </div>
      </section>

      <SupabaseAnimePreview />

      <section>
        <SectionHeader
          title="Recent Additions"
          action={
            <Link href="/diary" className={cn(buttonVariants({ variant: "ghost" }))}>
              View All
            </Link>
          }
        />
        <AnimeGrid>
          {placeholderAnime.slice(0, 5).map((anime) => (
            <AnimeCard key={anime.slug} {...anime} />
          ))}
        </AnimeGrid>
      </section>

      <section>
        <SectionHeader
          title="Highest Rated"
          action={
            <Link href="/favorites" className={cn(buttonVariants({ variant: "ghost" }))}>
              View Favorites
            </Link>
          }
        />
        <AnimeGrid>
          {placeholderAnime.slice(5, 10).map((anime) => (
            <AnimeCard key={anime.slug} {...anime} />
          ))}
        </AnimeGrid>
      </section>
    </Container>
  )
}