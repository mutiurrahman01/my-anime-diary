-- =======================================================
-- Migration: 20260726170208_rls_auto_enable_hardening.sql
-- Purpose:
--   Secure the internal rls_auto_enable() function
-- =======================================================

BEGIN;

-- Remove EXECUTE permission from all public API roles
REVOKE EXECUTE
ON FUNCTION public.rls_auto_enable()
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.rls_auto_enable()
FROM anon;

REVOKE EXECUTE
ON FUNCTION public.rls_auto_enable()
FROM authenticated;

-- Keep postgres/service_role working
GRANT EXECUTE
ON FUNCTION public.rls_auto_enable()
TO postgres;

GRANT EXECUTE
ON FUNCTION public.rls_auto_enable()
TO service_role;

COMMIT;