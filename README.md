# 📋 TapTapTidy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Chore-tracking app (work in progress).

## Development

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running) and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```sh
npm install
copy .env.example .env          # Windows (or: cp .env.example .env)
npm run supabase:start          # first time pulls images; takes a few minutes
npm run supabase:status         # optional — verify API URL + keys
npm run dev
```

Stop the local stack when done: `npm run supabase:stop`.

## Supabase (local)

Development uses **local Supabase** via Docker. The app connects through `src/lib/supabase.ts`:

| Variable | Description |
|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Local API URL (default `http://127.0.0.1:54331`) |
| `PUBLIC_SUPABASE_ANON_KEY` | Publishable / anon key from `supabase status` |

Copy `.env.example` → `.env` and set the key from `supabase status`. **Do not commit `.env`** or use `service_role` in `PUBLIC_` vars.

### Daily workflow

1. Start **Docker Desktop**
2. `npm run supabase:start`
3. `npm run dev`
4. Optional: open local Studio at the URL from `supabase status` (default `http://127.0.0.1:54333`)

Ports are configured in `supabase/config.toml` (API `54331`, DB `54332`, Studio `54333`). If `supabase start` reports a port conflict, adjust those values or stop the other local stack using the same ports.

Schema and migrations live in `supabase/migrations/`. Reset the local database after applying migrations: `supabase db reset`.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm test` — run unit tests
- `npm run supabase:start` / `supabase:stop` / `supabase:status` — local Supabase stack

## Styling

Styles use **SCSS** with [`@use`](https://sass-lang.com/documentation/at-rules/use/) partials (not `@import`).

| Path | Purpose |
|------|---------|
| `src/styles/_variables.scss` | Design tokens (spacing, colors, typography, radii) |
| `src/styles/_mixins.scss` | Shared mixins (`focus-ring`, `sr-only`, …) |
| `src/styles/global.scss` | Base reset, `:root` CSS custom properties, `body` defaults |

`global.scss` is imported once in `src/routes/+layout.svelte` (via the layout `<script>`). Components use scoped `<style lang="scss">` and load tokens with:

```scss
@use '../styles/variables' as *;
// or: @use '../styles/mixins' as *;
```

Prefer **CSS custom properties** (`var(--color-text)`) in component styles so themes and dark mode can swap values on `:root` later without changing every file.
