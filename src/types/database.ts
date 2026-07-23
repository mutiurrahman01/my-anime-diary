export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AnimeSource = "MANUAL" | "API" | "AI_SEED"

export type WatchStatus =
  | "WATCHING"
  | "COMPLETED"
  | "ON_HOLD"
  | "DROPPED"
  | "PLAN_TO_WATCH"

export interface Database {
  public: {
    Tables: {
      anime: {
        Row: {
          id: string
          mal_id: number | null
          title: string
          english_title: string | null
          japanese_title: string | null
          slug: string
          synopsis: string | null
          cover_image: string | null
          banner_image: string | null
          trailer_url: string | null
          episodes: number | null
          duration: string | null
          status: string | null
          type: string | null
          rating: string | null
          score: number | null
          popularity: number | null
          genres: string[] | null
          studios: string[] | null
          source: AnimeSource
          release_year: number | null
          deleted_at: string | null
          image_metadata: Json
          created_by: string | null
          updated_by: string | null
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mal_id?: number | null
          title: string
          english_title?: string | null
          japanese_title?: string | null
          slug: string
          synopsis?: string | null
          cover_image?: string | null
          banner_image?: string | null
          trailer_url?: string | null
          episodes?: number | null
          duration?: string | null
          status?: string | null
          type?: string | null
          rating?: string | null
          score?: number | null
          popularity?: number | null
          genres?: string[] | null
          studios?: string[] | null
          source: AnimeSource
          release_year?: number | null
          deleted_at?: string | null
          image_metadata?: Json
          created_by?: string | null
          updated_by?: string | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mal_id?: number | null
          title?: string
          english_title?: string | null
          japanese_title?: string | null
          slug?: string
          synopsis?: string | null
          cover_image?: string | null
          banner_image?: string | null
          trailer_url?: string | null
          episodes?: number | null
          duration?: string | null
          status?: string | null
          type?: string | null
          rating?: string | null
          score?: number | null
          popularity?: number | null
          genres?: string[] | null
          studios?: string[] | null
          source?: AnimeSource
          release_year?: number | null
          deleted_at?: string | null
          image_metadata?: Json
          created_by?: string | null
          updated_by?: string | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          social_links: Json
          preferred_genres: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          social_links?: Json
          preferred_genres?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          social_links?: Json
          preferred_genres?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_anime: {
        Row: {
          id: string
          user_id: string
          anime_id: string
          favorite: boolean | null
          rating: number | null
          watch_status: WatchStatus
          notes: string | null
          episodes_watched: number | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          anime_id: string
          favorite?: boolean | null
          rating?: number | null
          watch_status: WatchStatus
          notes?: string | null
          episodes_watched?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          anime_id?: string
          favorite?: boolean | null
          rating?: number | null
          watch_status?: WatchStatus
          notes?: string | null
          episodes_watched?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      anime_source_enum: AnimeSource
      watch_status_enum: WatchStatus
    }
    CompositeTypes: Record<string, never>
  }
}

export type AnimeRow = Database["public"]["Tables"]["anime"]["Row"]
export type AnimeInsert = Database["public"]["Tables"]["anime"]["Insert"]
export type UserAnimeRow = Database["public"]["Tables"]["user_anime"]["Row"]
export type UserAnimeInsert = Database["public"]["Tables"]["user_anime"]["Insert"]
export type UserAnimeUpdate = Database["public"]["Tables"]["user_anime"]["Update"]

export type AnimeListItem = Pick<
  AnimeRow,
  "id" | "mal_id" | "title" | "english_title" | "slug" | "cover_image" | "release_year" | "score"
>
