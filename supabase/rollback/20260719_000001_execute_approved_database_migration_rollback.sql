-- ============================================================
-- My Anime Diary - Database Rollback
-- Must be run in the reverse order of the forward migration.
-- ============================================================

ALTER TABLE user_anime DISABLE ROW LEVEL SECURITY;
ALTER TABLE anime DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP POLICY IF EXISTS user_anime_delete_own ON user_anime;
DROP POLICY IF EXISTS user_anime_update_own ON user_anime;
DROP POLICY IF EXISTS user_anime_insert_own ON user_anime;
DROP POLICY IF EXISTS user_anime_select_own ON user_anime;
DROP POLICY IF EXISTS anime_select_public ON anime;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_select_own ON profiles;

DROP TRIGGER IF EXISTS trigger_user_anime_updated_at ON user_anime;
DROP TRIGGER IF EXISTS trigger_anime_updated_at ON anime;
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS public.set_updated_at();

DROP INDEX IF EXISTS idx_profiles_preferred_genres;
DROP INDEX IF EXISTS idx_user_anime_completed_at;
DROP INDEX IF EXISTS idx_user_anime_started_at;
DROP INDEX IF EXISTS idx_user_anime_episodes_watched;
DROP INDEX IF EXISTS idx_user_anime_favorite;
DROP INDEX IF EXISTS idx_user_anime_rating;
DROP INDEX IF EXISTS idx_user_anime_status;
DROP INDEX IF EXISTS idx_user_anime_user_id;
DROP INDEX IF EXISTS idx_anime_studios;
DROP INDEX IF EXISTS idx_anime_genres;
DROP INDEX IF EXISTS idx_anime_last_synced_at;
DROP INDEX IF EXISTS idx_anime_source;
DROP INDEX IF EXISTS idx_anime_search_vector;
DROP INDEX IF EXISTS idx_anime_deleted_at;
DROP INDEX IF EXISTS idx_anime_japanese_title_trgm;
DROP INDEX IF EXISTS idx_anime_english_title_trgm;
DROP INDEX IF EXISTS idx_anime_title_trgm;

ALTER TABLE anime DROP COLUMN IF EXISTS search_vector;

ALTER TABLE user_anime DROP CONSTRAINT IF EXISTS user_anime_user_anime_unique;
ALTER TABLE user_anime DROP CONSTRAINT IF EXISTS user_anime_rating_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE anime DROP CONSTRAINT IF EXISTS anime_slug_unique;
ALTER TABLE anime DROP CONSTRAINT IF EXISTS anime_mal_id_unique;
ALTER TABLE user_anime DROP CONSTRAINT IF EXISTS user_anime_anime_id_fkey;
ALTER TABLE user_anime DROP CONSTRAINT IF EXISTS user_anime_user_id_fkey;
ALTER TABLE anime DROP CONSTRAINT IF EXISTS anime_updated_by_fkey;
ALTER TABLE anime DROP CONSTRAINT IF EXISTS anime_created_by_fkey;
ALTER TABLE user_anime DROP CONSTRAINT IF EXISTS user_anime_pkey;
ALTER TABLE anime DROP CONSTRAINT IF EXISTS anime_pkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_unique;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;

DROP TABLE IF EXISTS user_anime;
DROP TABLE IF EXISTS anime;
DROP TABLE IF EXISTS profiles;

DROP TYPE IF EXISTS watch_status_enum;
DROP TYPE IF EXISTS anime_source_enum;
