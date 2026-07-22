-- ============================================================
-- My Anime Diary - Database Migration
-- Safe execution order: ENUMs -> Tables -> PKs -> FKs -> Uniques -> Checks -> Generated -> Indexes -> Triggers -> RLS
-- ============================================================

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Phase 1: ENUM Types
-- ============================================================

DO $$ BEGIN
    CREATE TYPE watch_status_enum AS ENUM (
        'WATCHING',
        'COMPLETED',
        'ON_HOLD',
        'DROPPED',
        'PLAN_TO_WATCH'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE anime_source_enum AS ENUM (
        'MANUAL',
        'API',
        'AI_SEED'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Phase 2: Tables (No Constraints)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    preferred_genres TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anime (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    mal_id INTEGER,
    title TEXT NOT NULL,
    english_title TEXT,
    japanese_title TEXT,
    slug TEXT NOT NULL,
    synopsis TEXT,
    cover_image TEXT,
    banner_image TEXT,
    trailer_url TEXT,
    episodes INTEGER,
    duration TEXT,
    status TEXT,
    type TEXT,
    rating TEXT,
    score DECIMAL(3,2),
    popularity INTEGER,
    genres TEXT[],
    studios TEXT[],
    source anime_source_enum NOT NULL,
    deleted_at TIMESTAMPTZ,
    image_metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID,
    updated_by UUID,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_anime (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    anime_id UUID NOT NULL,
    favorite BOOLEAN DEFAULT FALSE,
    rating INTEGER,
    watch_status watch_status_enum NOT NULL,
    notes TEXT,
    episodes_watched INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Phase 3: Primary Keys & Not-Null
-- ============================================================

ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE profiles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;

ALTER TABLE anime ADD CONSTRAINT anime_pkey PRIMARY KEY (id);
ALTER TABLE anime ALTER COLUMN title SET NOT NULL;
ALTER TABLE anime ALTER COLUMN slug SET NOT NULL;
ALTER TABLE anime ALTER COLUMN source SET NOT NULL;

ALTER TABLE user_anime ADD CONSTRAINT user_anime_pkey PRIMARY KEY (id);
ALTER TABLE user_anime ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_anime ALTER COLUMN anime_id SET NOT NULL;
ALTER TABLE user_anime ALTER COLUMN watch_status SET NOT NULL;

-- ============================================================
-- Phase 4: Foreign Keys
-- ============================================================

-- profiles.id -> auth.users is handled by the Supabase Auth trigger

ALTER TABLE anime
    ADD CONSTRAINT anime_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE anime
    ADD CONSTRAINT anime_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE user_anime
    ADD CONSTRAINT user_anime_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_anime
    ADD CONSTRAINT user_anime_anime_id_fkey
    FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE;

-- ============================================================
-- Phase 5: Unique Constraints
-- ============================================================

ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
ALTER TABLE anime ADD CONSTRAINT anime_mal_id_unique UNIQUE (mal_id);
ALTER TABLE anime ADD CONSTRAINT anime_slug_unique UNIQUE (slug);
ALTER TABLE user_anime ADD CONSTRAINT user_anime_user_anime_unique UNIQUE (user_id, anime_id);

-- ============================================================
-- Phase 6: Check Constraints
-- ============================================================

ALTER TABLE user_anime ADD CONSTRAINT user_anime_rating_check
    CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10));

-- ============================================================
-- Phase 7: Generated Column
-- ============================================================

ALTER TABLE anime
    ADD COLUMN IF NOT EXISTS search_vector TSVECTOR
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(english_title, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(japanese_title, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(synopsis, '')), 'C')
    ) STORED;

-- ============================================================
-- Phase 8: Indexes
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_anime_title_trgm ON anime USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_anime_english_title_trgm ON anime USING GIN (english_title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_anime_japanese_title_trgm ON anime USING GIN (japanese_title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_anime_deleted_at ON anime (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_anime_search_vector ON anime USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_anime_source ON anime (source);
CREATE INDEX IF NOT EXISTS idx_anime_last_synced_at ON anime (last_synced_at);
CREATE INDEX IF NOT EXISTS idx_anime_genres ON anime USING GIN (genres);
CREATE INDEX IF NOT EXISTS idx_anime_studios ON anime USING GIN (studios);
CREATE INDEX IF NOT EXISTS idx_user_anime_user_id ON user_anime (user_id);
CREATE INDEX IF NOT EXISTS idx_user_anime_status ON user_anime (user_id, watch_status);
CREATE INDEX IF NOT EXISTS idx_user_anime_rating ON user_anime (user_id, rating);
CREATE INDEX IF NOT EXISTS idx_user_anime_favorite ON user_anime (user_id, favorite) WHERE favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_anime_episodes_watched ON user_anime (user_id, episodes_watched);
CREATE INDEX IF NOT EXISTS idx_user_anime_started_at ON user_anime (user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_user_anime_completed_at ON user_anime (user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_genres ON profiles USING GIN (preferred_genres);

-- Note: the approved slug, username, and mal_id uniqueness requirements are implemented via unique constraints,
-- so separate duplicate indexes for those columns are intentionally omitted.

-- ============================================================
-- Phase 9: Triggers (updated_at auto-update)
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_anime_updated_at ON anime;
CREATE TRIGGER trigger_anime_updated_at
    BEFORE UPDATE ON anime
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_user_anime_updated_at ON user_anime;
CREATE TRIGGER trigger_user_anime_updated_at
    BEFORE UPDATE ON user_anime
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Phase 10: Row Level Security (RLS) & Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_anime ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS anime_select_public ON anime;
CREATE POLICY anime_select_public ON anime
    FOR SELECT USING (true);

DROP POLICY IF EXISTS user_anime_select_own ON user_anime;
CREATE POLICY user_anime_select_own ON user_anime
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_anime_insert_own ON user_anime;
CREATE POLICY user_anime_insert_own ON user_anime
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_anime_update_own ON user_anime;
CREATE POLICY user_anime_update_own ON user_anime
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_anime_delete_own ON user_anime;
CREATE POLICY user_anime_delete_own ON user_anime
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Auth Trigger: Create profile row for new users
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (
        NEW.id,
        COALESCE(
            NULLIF(NEW.raw_user_meta_data->>'username', ''),
            NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
            NEW.id::text
        )
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
