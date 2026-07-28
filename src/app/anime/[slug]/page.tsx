import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { DiaryEntryDialog } from "@/components/shared/diary-entry-dialog";
import { createClient } from "@/lib/supabase/server";
import { getAnimeByMalId, getAnimeBySlug } from "@/services/anime.service";
import { getDiaryEntry } from "@/services/user-anime.service";
import { cn } from "@/lib/utils";
import { SITE_URL, OG_IMAGE, TWITTER_IMAGE } from "@/lib/site";

// ---------- Helper Functions ----------
async function fetchAnime(param: string) {
  if (process.env.NODE_ENV === "development") {
    console.log("📄 Page slug param:", param);
  }
  const malId = Number(param);

  try {
    const supabase = await createClient();

    if (!Number.isInteger(malId) || malId <= 0) {
      const { data, error } = await getAnimeBySlug(supabase, param);
      if (error) throw new Error(error);
      return data;
    }

    const { data, error } = await getAnimeByMalId(supabase, malId);
    if (error) throw new Error(error);
    return data;
  } catch {
    return null;
  }
}

function formatArray(value: string[] | null) {
  return value?.length ? value.join(", ") : "Unknown";
}

function getMediaType(anime: any): string {
  if (anime.type === "TV") return "TV Series";
  if (anime.type === "Movie") return "Movie";
  if (anime.type === "OVA") return "OVA";
  if (anime.type === "ONA") return "ONA";
  if (anime.type === "Special") return "Special";
  return "Anime";
}

function generateMetaTitle(anime: any): string {
  const mediaType = getMediaType(anime);
  return `${anime.title} (${mediaType}) – Watchlist, Rating & Diary | AnimeDiary`;
}

function generateMetaDescription(anime: any): string {
  const synopsis = anime.synopsis?.trim() || "";
  const base = synopsis.length > 0
    ? synopsis.slice(0, 155)
    : `Read ${anime.title} details, synopsis, genres, episodes, studios and keep it in your AnimeDiary watchlist.`;
  return base.length > 0 ? base : `Track ${anime.title} in your AnimeDiary – rate, review, and organize your anime watchlist.`;
}

// ---------- Metadata ----------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const anime = await fetchAnime(slug);

  if (!anime) {
    return {
      title: "Anime Not Found | AnimeDiary",
      description: "The requested anime could not be found.",
    };
  }

  const title = generateMetaTitle(anime);
  const description = generateMetaDescription(anime);
  const imageUrl = anime.cover_image || OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: anime.title,
        },
      ],
      url: `${SITE_URL}/anime/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/anime/${slug}`,
    },
  };
}

// ---------- Page Component ----------
export default async function AnimeDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const anime = await fetchAnime(slug);

  if (!anime) {
    notFound();
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
  ];

  const bannerImage = anime.banner_image ?? anime.cover_image;
  const coverImage = anime.cover_image ?? anime.banner_image;

  let user = null;
  let diaryEntry = null;

  try {
    const supabase = await createClient();
    const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
    user = authenticatedUser;

    if (user) {
      const entryResult = await getDiaryEntry(user.id, anime.id);
      diaryEntry = entryResult.error ? null : entryResult.data;
    }
  } catch {
    user = null;
    diaryEntry = null;
  }

  // ---------- JSON-LD (Structured Data) ----------
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: anime.title,
    alternateName: anime.english_title || anime.japanese_title || undefined,
    description: anime.synopsis?.trim() || undefined,
    image: anime.cover_image || undefined,
    url: `${SITE_URL}/anime/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/anime/${slug}`,
    },
    numberOfEpisodes: anime.episodes ?? undefined,
    genre: anime.genres?.join(", ") || undefined,
    datePublished: anime.release_year ? `${anime.release_year}-01-01` : undefined,
    aggregateRating: anime.score
      ? {
          "@type": "AggregateRating",
          ratingValue: anime.score,
          bestRating: 10,
        }
      : undefined,
  };

  // ---------- Breadcrumb Schema ----------
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Anime",
        item: `${SITE_URL}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: anime.title,
        item: `${SITE_URL}/anime/${slug}`,
      },
    ],
  };

  // ---------- Render ----------
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Container className="space-y-8 py-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          {/* Banner */}
          {bannerImage ? (
            <div className="relative h-64 w-full overflow-hidden bg-slate-950">
              <Image
                src={bannerImage}
                alt={anime.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
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
              {/* Cover Image */}
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-muted aspect-[3/4]">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={`${anime.title} cover`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 280px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
                      No cover image available
                    </div>
                  )}
                </div>

                {/* Title & Alt Titles */}
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

              {/* Main Content */}
              <div className="space-y-6">
                {/* Overview Tags */}
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

                  {/* Diary Section */}
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Diary</h2>
                        <p className="text-sm text-muted-foreground">
                          Keep this anime in your private diary with your status, rating, and notes.
                        </p>
                      </div>
                      <DiaryEntryDialog
                        key={
                          diaryEntry
                            ? `${diaryEntry.id}-${diaryEntry.favorite ? "favorite" : "not-favorite"}`
                            : "new"
                        }
                        animeId={anime.id}
                        animeTitle={anime.title}
                        entry={diaryEntry}
                        isLoggedIn={Boolean(user)}
                      />
                    </div>

                    {/* Synopsis */}
                    <div>
                      <h2 className="text-xl font-semibold">Synopsis</h2>
                      <p className="mt-3 leading-7 text-muted-foreground">
                        {anime.synopsis?.trim() || "No synopsis available."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related Anime */}
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
    </>
  );
}