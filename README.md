# 📋 TapTapTidy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Chore-tracking app (work in progress).

## Tech stack

| Layer | Choice |
|-------|--------|
| **UI** | [SvelteKit](https://kit.svelte.dev/) (TypeScript, client-side SPA, `ssr: false`) |
| **Build** | [Vite](https://vitejs.dev/), [`@sveltejs/adapter-static`](https://svelte.dev/docs/kit/adapters) with SPA fallback → static output in `build/` |
| **Data & auth** | [Supabase](https://supabase.com/) — Postgres and Auth via [`@supabase/supabase-js`](https://github.com/supabase/supabase-js) + [`@supabase/ssr`](https://github.com/supabase/ssr) browser client |
| **Local backend** | [Supabase CLI](https://supabase.com/docs/guides/cli) + Docker ([`supabase/config.toml`](supabase/config.toml)) |
| **Styles** | [SCSS](https://sass-lang.com/) (`sass`), design tokens under `src/styles/` |
| **Tests** | [Vitest](https://vitest.dev/) (`npm test`) |
| **Hosting (optional)** | Repo includes [`netlify.toml`](netlify.toml) for static deploy; any host that serves `build/` works |

## Prerequisites

- **Node.js 20** (see [`.nvmrc`](.nvmrc))
- **npm**
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (running during local Supabase)
- **[Supabase CLI](https://supabase.com/docs/guides/cli)**

## Getting started

```sh
npm install
copy .env.example .env          # Windows (or: cp .env.example .env)
npm run supabase:start          # first time pulls images; can take several minutes
npm run supabase:status         # optional — confirm API URL and copy the publishable key into .env
npm run dev
```

Stop the local Supabase stack when finished: `npm run supabase:stop`.

## Supabase (local)

Development uses **local Supabase** via Docker. The app connects through [`src/lib/supabase.ts`](src/lib/supabase.ts):

| Variable | Description |
|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Local API URL (default `http://127.0.0.1:54331`) |
| `PUBLIC_SUPABASE_ANON_KEY` | Publishable / anon key from `supabase status` |

Copy `.env.example` → `.env` and set the key from `supabase status`. **Do not commit `.env`** or use `service_role` in `PUBLIC_` variables.

### Daily workflow

1. Start **Docker Desktop**
2. `npm run supabase:start`
3. `npm run dev`
4. Optional: open local Studio at the URL from `supabase status` (default `http://127.0.0.1:54333`)

Ports are configured in [`supabase/config.toml`](supabase/config.toml) (API `54331`, DB `54332`, Studio `54333`). If `supabase start` reports a port conflict, change those values or stop the other stack using the same ports.

Schema and migrations live in [`supabase/migrations/`](supabase/migrations/).

### Database migrations

- Add new files under [`supabase/migrations/`](supabase/migrations/) using the CLI (`supabase migration new <name>`) or matching the timestamped naming convention.
- **`supabase db reset`** tears down local Postgres and reapplies migrations (and [`supabase/seed.sql`](supabase/seed.sql) if `[db.seed]` is enabled). Use this after editing SQL so local state matches the repo.
- With the stack stopped, you can also run **`supabase start`**; migrations apply on first boot. After changes, **`supabase db reset`** is the usual way to confirm everything applies cleanly.
- Row Level Security and policies on **domain tables** arrive with later schema tickets; this repo’s first migration intentionally avoids `public` app tables until that design is finalized.

Local **Auth** (Studio → Authentication → URL configuration): keep **Site URL** aligned with where you load the SPA (for example `http://127.0.0.1:5173` for Vite, or `http://localhost:5173`). Add the same origins under **Redirect URLs** if you use magic links or OAuth later. Confirm whether **Confirm email** is required for testing; Mailpit/Inbucket shows signup mail when email confirmation is enabled locally.

### Hosted Supabase (apply migrations remotely)

Same SQL in [`supabase/migrations/`](supabase/migrations/) should run on your **hosted** project when you’re ready ([Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) required).

**One-time per machine / project:**

```sh
npm run supabase:remote:login
npm run supabase:remote:link -- --project-ref <REFERENCE_ID>
```

`<REFERENCE_ID>` is under **Dashboard → Project Settings → General**. The CLI may prompt for the **database password** (never commit it). Link state stays local.

**Whenever you want to ship migrations:**

```sh
npm run supabase:remote:push
```

That runs [`scripts/supabase-remote-push.mjs`](scripts/supabase-remote-push.mjs): prints migration status, asks for confirmation, then runs `supabase db push` against the linked project.

Direct CLI equivalents: `npm run supabase:remote:migrations`, `npm run supabase:remote:push:cli`.

Point the **app** at hosted data with `PUBLIC_SUPABASE_*` from **Project Settings → API** (different from CLI link — used by Vite/SvelteKit).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server ([Vite](https://vitejs.dev/)) |
| `npm run build` | Production static build → `build/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests (Vitest, once) |
| `npm run test:unit` | Vitest in watch mode |
| `npm run check` | Type-check Svelte/TS ([svelte-check](https://github.com/sveltejs/svelte-check)) |
| `npm run supabase:start` | Start local Supabase (Docker) |
| `npm run supabase:stop` | Stop local Supabase |
| `npm run supabase:status` | Show local URLs and keys |
| `npm run supabase:db:reset` | Recreate local DB and reapply migrations |
| `npm run supabase:remote:login` | Supabase CLI login (hosted projects) |
| `npm run supabase:remote:link` | Link CLI to a hosted project (`--project-ref`) |
| `npm run supabase:remote:migrations` | List local vs linked remote migration status |
| `npm run supabase:remote:push` | Confirm, then push pending migrations (see Hosted Supabase above) |
| `npm run supabase:remote:push:cli` | Run `supabase db push` without the confirmation script |

## Styling

Styles use **SCSS** with [`@use`](https://sass-lang.com/documentation/at-rules/use/) partials (not `@import`).

| Path | Purpose |
|------|---------|
| [`src/styles/_variables.scss`](src/styles/_variables.scss) | Design tokens (spacing, colors, typography, radii) |
| [`src/styles/_mixins.scss`](src/styles/_mixins.scss) | Shared mixins (`focus-ring`, `sr-only`, …) |
| [`src/styles/global.scss`](src/styles/global.scss) | Base reset, `:root` CSS custom properties, `body` defaults |

[`global.scss`](src/styles/global.scss) is imported from [`src/routes/+layout.svelte`](src/routes/+layout.svelte). Components use scoped `<style lang="scss">` and load tokens with:

```scss
@use '../styles/variables' as *;
// or: @use '../styles/mixins' as *;
```

Prefer **CSS custom properties** (`var(--color-text)`) in component styles so themes and dark mode can swap values on `:root` later without changing every file.

## Contributing & security

- [**CONTRIBUTING.md**](CONTRIBUTING.md) — how to contribute, issues, and pull requests
- [**SECURITY.md**](SECURITY.md) — how to report vulnerabilities privately

## License

[MIT](LICENSE)
