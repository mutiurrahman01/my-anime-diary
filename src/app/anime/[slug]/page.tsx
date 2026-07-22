import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Container } from "@/components/layout/container"
import { RatingStars } from "@/components/shared/rating-stars"
import { createClient } from "@/lib/supabase/server"
import { getAnimeBySlug } from "@/services/anime.service"
import type { AnimeRow } from "@/types/database"
import { cn } from "@/lib/utils"

type AnimeDetailsPageProps = {
  params: {
    slug: string
  }
}

async function fetchAnime(slug: string) {
  const supabase = await createClient()
  const { data, error } = await getAnimeBySlug(supabase, slug)

  if (error) {
    throw new Error(error)
  }

  return data
}

function formatArray(value: string[] | null) {
  return value?.length ? value.join(", ") : "Unknown"
}

function formatDescription(synopsis: string | null) {
  const text = synopsis?.trim() || "No synopsis available."
  return text.length > 150 ? `${text.slice(0, 147)}...` : text
}

export async function generateMetadata({ params }: AnimeDetailsPageProps): Promise<Metadata> {
  const anime = await fetchAnime(params.slug)

  if (!anime) {
    return {
      title: "Anime Not Found | AnimeDiary",
      description: "The requested anime was not found.",
    }
  }

  return {
    title: `${anime.title} | AnimeDiary`,
    description: formatDescription(anime.synopsis),
  }
}

export default async function AnimeDetailsPage({ params }: AnimeDetailsPageProps) {
  const anime = await fetchAnime(params.slug)

  if (!anime) {
    notFound()
  }

  const overview = [
    { label: "Type", value: anime.type ?? "Unknown" },
    { label: "Status", value: anime.status ?? "Unknown" },
    { label: "Source", value: anime.source ?? "Unknown" },
    { label: "Rating", value: anime.rating ?? "Unknown" },
    { label: "Score", value: anime.score !== null ? anime.score : "N/A" },
    { label: "Popularity", value: anime.popularity ?? "N/A" },
    { label: "Episodes", value: anime.episodes ?? "N/A" },
    { label: "MAL ID", value: anime.mal_id ?? "N/A" },
  ]

  const bannerImage = anime.banner_image ?? anime.cover_image
  const coverImage = anime.cover_image ?? anime.banner_image

  return (
    <Container className="space-y-8 py-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {bannerImage ? (
          <div className="relative h-64 w-full overflow-hidden bg-slate-950">
            <img
              src={bannerImage}
              alt={anime.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/90 to-transparent" />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center bg-slate-950 text-muted-foreground">
            No banner available
          </div>
        )}

        <div className="px-6 py-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-border bg-muted">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={`${anime.title} cover`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-96 items-center justify-center p-8 text-center text-sm text-muted-foreground">
                    No cover image available
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-3xl border border-border bg-background p-5">
                <div className="space-y-1">
                  <h1 className="text-3xl font-semibold tracking-tight">{anime.title}</h1>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {anime.english_title || anime.japanese_title
                      ? [anime.english_title, anime.japanese_title]
                          .filter(Boolean)
                          .join(" · ")
                      : "No alternate titles available."}
                  </p>
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Genres:</span>{" "}
                    {formatArray(anime.genres)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Studios:</span>{" "}
                    {formatArray(anime.studios)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {overview.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground",
                        item.label === "Score" ? "bg-emerald-500/10 border-emerald-500/20" : ""
                      )}
                    >
                      <span className="text-muted-foreground">{item.label}:</span>{" "}
                      <span className="text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Synopsis</h2>
                    <p className="mt-3 leading-7 text-muted-foreground">
                      {anime.synopsis?.trim() || "No synopsis available."}
                    </p>
                  </div>
                </div>
              </div>

              <section className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Related anime</h2>
                    <p className="text-sm text-muted-foreground">
                      Recommendations are not available yet. Check back soon.
                    </p>
                  </div>
                  <span className="rounded-full border border-muted px-3 py-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Coming soon
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
