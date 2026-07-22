-- Add release_year to anime (documented in DATABASE.md, used by dashboard/search)
ALTER TABLE anime
    ADD COLUMN IF NOT EXISTS release_year INTEGER;

CREATE INDEX IF NOT EXISTS idx_anime_release_year ON anime (release_year)
    WHERE deleted_at IS NULL;
