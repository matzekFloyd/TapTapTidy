/*
 * TapTapTidy — auth phase bootstrap migration
 *
 * Supabase Auth (sign-up / sign-in) uses the managed `auth` schema (`auth.users`, sessions).
 * No public tables are required for email auth to work via the JS client.
 *
 * Row Level Security on application tables and triggers such as auth.users → public.profiles
 * are deferred until domain schema tickets define those shapes.
 */

-- Common extensions for later migrations (idempotent).
-- Prefer the `extensions` schema as Supabase does for hosted projects.

create extension if not exists "pgcrypto" with schema extensions;

create extension if not exists "uuid-ossp" with schema extensions;
