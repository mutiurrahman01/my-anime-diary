"use client"

import * as React from "react"
import { AlertCircle, SearchIcon } from "lucide-react"

import { Container } from "@/components/layout/container"
import { SearchBar } from "@/components/shared/search-bar"
import { PageHeader } from "@/components/shared/page-header"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { EmptyState } from "@/components/shared/empty-state"
import { AnimeGridSkeleton } from "@/components/shared/loading-skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import { createClient } from "@/lib/supabase/client"
import { searchAnime } from "@/services/anime.service"
import type { AnimeListItem } from "@/types/database"

export default function SearchPage() {
  const supabase = React.useMemo(() => createClient(), [])
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = React.useState<AnimeListItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [hasFetched, setHasFetched] = React.useState(false)

  React.useEffect(() => {
    let isCancelled = false

    async function runSearch() {
      setIsLoading(true)
      setError(null)

      const response = await searchAnime(supabase, debouncedQuery)

      if (isCancelled) {
        return
      }

      setResults(response.data)
      setError(response.error)
      setHasFetched(true)
      setIsLoading(false)
    }

    void runSearch()

    return () => {
      isCancelled = true
    }
  }, [debouncedQuery, supabase])

  const trimmedQuery = query.trim()
  const showInitialHint = !trimmedQuery && !isLoading && hasFetched && results.length > 0
  const showEmptyCatalogue =
    !trimmedQuery && !isLoading && hasFetched && results.length === 0 && !error
  const showNoResults =
    Boolean(trimmedQuery) && !isLoading && hasFetched && results.length === 0 && !error

  return (
    <Container className="space-y-8 py-8">
      <PageHeader
        title="Search Anime"
        description="Find new anime to add to your diary."
      />

      <div className="max-w-2xl space-y-2">
        <SearchBar
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title..."
          aria-label="Search anime by title"
        />
        {showInitialHint && (
          <p className="text-sm text-muted-foreground">
            Popular anime from the catalogue. Start typing to search by title.
          </p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <AnimeGridSkeleton count={12} />
      ) : showEmptyCatalogue ? (
        <EmptyState
          icon={SearchIcon}
          title="No anime in the catalogue yet"
          description="Run npm run seed:anime to import anime data, then refresh this page."
        />
      ) : showNoResults ? (
        <EmptyState
          icon={SearchIcon}
          title="No anime found"
          description={`No anime matched "${trimmedQuery}". Try a different search term.`}
        />
      ) : (
        <AnimeGrid>
          {results.map((anime) => (
            <AnimeCard
              key={anime.id}
              title={anime.english_title?.trim() || anime.title}
              slug={anime.slug}
              malId={anime.mal_id ?? null}
              coverImage={anime.cover_image ?? undefined}
              releaseYear={anime.release_year ?? undefined}
              rating={anime.score !== null ? Math.round(anime.score) : undefined}
            />
          ))}
        </AnimeGrid>
      )}
    </Container>
  )
}
