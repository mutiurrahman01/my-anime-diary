-- ===============================================================
-- Rollback: 20260726170208_rls_auto_enable_hardening_rollback.sql
-- ===============================================================

BEGIN;

GRANT EXECUTE
ON FUNCTION public.rls_auto_enable()
TO PUBLIC;

GRANT EXECUTE
ON FUNCTION public.rls_auto_enable()
TO anon;

GRANT EXECUTE
ON FUNCTION public.rls_auto_enable()
TO authenticated;

COMMIT;