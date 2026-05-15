# 📋 TapTapTidy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Chore-tracking app (work in progress).

## Development

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm test` — run unit tests

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
