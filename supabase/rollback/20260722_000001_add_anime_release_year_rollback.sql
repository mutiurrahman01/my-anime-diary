-- Rollback: remove release_year from anime
DROP INDEX IF EXISTS idx_anime_release_year;

ALTER TABLE anime
    DROP COLUMN IF EXISTS release_year;
