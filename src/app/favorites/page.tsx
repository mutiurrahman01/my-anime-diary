import Link from "next/link"
import { redirect } from "next/navigation"
import { Heart } from "lucide-react"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/shared/page-header"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ToggleFavoriteButton } from "@/components/shared/toggle-favorite-button"
import { buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { getUserFavorites } from "@/services/user-anime.service"

export default async function FavoritesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: favorites, error } = await getUserFavorites(user.id)

  return (
    <Container className="py-8 space-y-8">
      <PageHeader
        title="Favorites"
        description="Your most beloved anime shows."
        action={
          <Link href="/search" className={buttonVariants({ variant: "outline" })}>
            Search anime
          </Link>
        }
      />

      {error ? (
        <EmptyState
          icon={Heart}
          title="Unable to load favorites"
          description="Something went wrong fetching your favorite anime. Please try again later."
          action={
            <Link href="/search" className={buttonVariants()}>
              Browse anime
            </Link>
          }
        />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Start adding your favorite anime shows from search!"
          action={
            <Link href="/search" className={buttonVariants()}>
              Browse anime
            </Link>
          }
        />
      ) : (
        <AnimeGrid>
          {favorites.map((entry) => (
            <div key={entry.id} className="relative">
              <ToggleFavoriteButton entryId={entry.id} isFavorite={true} />
              <AnimeCard
                title={entry.anime?.title ?? "Unknown anime"}
                releaseYear={entry.anime?.release_year ?? undefined}
                coverImage={entry.anime?.cover_image ?? undefined}
                rating={entry.rating ?? undefined}
                slug={entry.anime?.slug ?? undefined}
              />
            </div>
          ))}
        </AnimeGrid>
      )}
    </Container>
  )
}
