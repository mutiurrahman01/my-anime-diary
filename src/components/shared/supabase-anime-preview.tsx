"use client"

import * as React from "react"
import { Loader2, RefreshCw, Database } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { EmptyState } from "@/components/shared/empty-state"

type AnimePreview = {
  id: string
  title: string
  slug: string
  cover_image: string | null
  score: number | null
  created_at: string
}

export function SupabaseAnimePreview() {
  const [items, setItems] = React.useState<AnimePreview[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = React.useState(false)

  async function loadAnime() {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: queryError } = await supabase
        .from("anime")
        .select("id, title, slug, cover_image, score, created_at")
        .order("created_at", { ascending: false })
        .limit(6)

      if (queryError) {
        throw queryError
      }

      setItems((data ?? []) as AnimePreview[])
      setHasLoaded(true)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load anime from Supabase."
      )
      setItems([])
      setHasLoaded(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            Supabase live action
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Load anime from Supabase</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Click the button to run a real database query from the frontend and render the latest anime rows.
          </p>
        </div>

        <Button onClick={loadAnime} disabled={isLoading} className="sm:self-start">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Load from Supabase
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {hasLoaded && !error && items.length === 0 && (
        <EmptyState
          icon={Database}
          title="No anime found"
          description="The query worked, but your anime table is still empty. Insert a row in Supabase and click again."
        />
      )}

      {items.length > 0 && (
        <AnimeGrid>
          {items.map((anime) => (
            <AnimeCard
              key={anime.id}
              title={anime.title}
              slug={anime.slug}
              coverImage={anime.cover_image ?? undefined}
              rating={anime.score !== null ? Math.round(anime.score) : undefined}
            />
          ))}
        </AnimeGrid>
      )}
    </section>
  )
}