-- =============================================================================
-- Creates databases for each service on the shared PostgreSQL instance.
-- Runs only on first startup (when postgres_data volume is empty).
-- =============================================================================

-- Authentik uses the default POSTGRES_DB (authentik) — no action needed.

-- Strapi
CREATE DATABASE strapi;

-- NKDevDynasty web app
CREATE DATABASE nkdevdynasty;
