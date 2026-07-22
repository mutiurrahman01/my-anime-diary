/**
 * Seeds the anime table from the Jikan API (MyAnimeList unofficial API).
 *
 * Usage:
 *   npm run seed:anime
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */

import { createClient } from "@supabase/supabase-js"

const JIKAN_BASE_URL = "https://api.jikan.moe/v4"
const REQUEST_DELAY_MS = 400
const TOP_ANIME_PAGES = 2
const BATCH_SIZE = 25

function slugifyAnimeTitle(title, malId) {
  const normalized = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  const base = normalized || "anime"

  return `${base}-${malId}`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchTopAnimePage(page) {
  const response = await fetch(`${JIKAN_BASE_URL}/top/anime?page=${page}`)

  if (!response.ok) {
    throw new Error(`Jikan API error (${response.status}) on page ${page}`)
  }

  const payload = await response.json()

  return payload.data ?? []
}

function mapJikanAnime(anime) {
  return {
    mal_id: anime.mal_id,
    title: anime.title,
    english_title: anime.title_english,
    japanese_title: anime.title_japanese,
    slug: slugifyAnimeTitle(anime.title, anime.mal_id),
    synopsis: anime.synopsis,
    cover_image:
      anime.images?.jpg?.large_image_url ??
      anime.images?.jpg?.image_url ??
      null,
    release_year: anime.year,
    episodes: anime.episodes,
    status: anime.status,
    type: anime.type,
    score: anime.score,
    popularity: anime.popularity,
    genres: anime.genres?.map((genre) => genre.name) ?? null,
    studios: anime.studios?.map((studio) => studio.name) ?? null,
    source: "API",
    last_synced_at: new Date().toISOString(),
  }
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

async function main() {
  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ""

  console.log("Service role key present:", !!supabaseKey)
  console.log("URL present:", !!supabaseUrl)

  if (supabaseKey) {
    console.log(
      "Service role key loaded:",
      `${supabaseKey.slice(0, 4)}...${supabaseKey.slice(-4)}`
    )
  } else if (anonKey) {
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY is not set; falling back to anon key for public inserts."
    )
    supabaseKey = anonKey
  }

  if (!supabaseKey) {
    throw new Error(
      "Missing required Supabase key: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  const collected = new Map()

  for (let page = 1; page <= TOP_ANIME_PAGES; page += 1) {
    console.log(`Fetching Jikan top anime page ${page}...`)
    const pageResults = await fetchTopAnimePage(page)

    for (const anime of pageResults) {
      collected.set(anime.mal_id, mapJikanAnime(anime))
    }

    if (page < TOP_ANIME_PAGES) {
      await sleep(REQUEST_DELAY_MS)
    }
  }

  const rows = Array.from(collected.values())
  console.log(`Prepared ${rows.length} unique anime rows for upsert.`)

  let inserted = 0

  for (let index = 0; index < rows.length; index += BATCH_SIZE) {
    const batch = rows.slice(index, index + BATCH_SIZE)
    const { error, status, statusText, data } = await supabase
      .from("anime")
      .upsert(batch, {
        onConflict: "mal_id",
      })

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        status,
        statusText,
        data,
      })
      throw new Error(`Supabase upsert failed: ${error.message}`)
    }

    inserted += batch.length
    console.log(`Upserted ${inserted}/${rows.length} anime...`)
  }

  console.log(`Done. Seeded ${rows.length} anime records.`)
}

main().catch((error) => {
  console.error("Seed script error:", error instanceof Error ? error : { error })
  process.exit(1)
})
