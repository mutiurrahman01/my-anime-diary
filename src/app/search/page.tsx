"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Container } from "@/components/layout/container"
import { SearchBar } from "@/components/shared/search-bar"
import { PageHeader } from "@/components/shared/page-header"
import { AnimeGrid } from "@/components/shared/anime-grid"
import { AnimeCard } from "@/components/shared/anime-card"
import { EmptyState } from "@/components/shared/empty-state"

const ALL_PLACEHOLDER_ANIME = Array.from({ length: 20 }).map((_, i) => ({
  title: [
    "Attack on Titan",
    "Fullmetal Alchemist",
    "Steins;Gate",
    "Hunter x Hunter",
    "One Punch Man",
    "Cowboy Bebop",
    "Violet Evergarden",
    "Your Lie in April",
    "Demon Slayer",
    "Spirited Away",
    "Death Note",
    "Naruto",
    "Neon Genesis Evangelion",
    "Bleach",
    "Dragon Ball Z",
    "Vinland Saga",
    "Spy x Family",
    "Chainsaw Man",
    "Jujutsu Kaisen",
    "Re:Zero",
  ][i],
  releaseYear: 2010 + (i % 13),
  slug: `placeholder-anime-${i + 1}`,
}))

export default function SearchPage() {
  const [query, setQuery] = React.useState("")

  const filteredAnime = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_PLACEHOLDER_ANIME
    return ALL_PLACEHOLDER_ANIME.filter((a) =>
      a.title.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <Container className="py-8 space-y-8">
      <PageHeader
        title="Search Anime"
        description="Find new anime to add to your diary."
      />

      <div className="max-w-2xl">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
        />
      </div>

      {filteredAnime.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No results found"
          description={`No anime matched "${query}". Try a different search term.`}
        />
      ) : (
        <AnimeGrid>
          {filteredAnime.map((anime) => (
            <AnimeCard key={anime.slug} {...anime} />
          ))}
        </AnimeGrid>
      )}
    </Container>
  )
}
