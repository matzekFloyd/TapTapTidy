# TapTapTidy brand

Canonical color, type, and voice. Interaction and layout live in [DESIGN.md](DESIGN.md). Disability access lives in [ACCESSIBILITY.md](ACCESSIBILITY.md). When building UI, put these tokens in `src/styles/_variables.scss`. The current accent blue (`#2563eb`) is leftover and is not part of the brand.

## What it is

TapTapTidy is a tiled surface you clear by tapping. The brand should feel like enamel and grout: a wiped counter, a labeled door, a chore you can finish with one hand. It is a household tool. It is not a productivity suite, a wellness journal, or a launcher full of app icons.

The name is **TapTapTidy**. One word, three capital Ts. Do not set it in all caps, do not split it with dots or dashes, and do not park a tagline under it on every screen.

## Voice

Plain verbs, sentence case, one job per line. The control and the result share a name: "Add a chore" adds it, "Archive" archives it, "Undo" puts it back. An empty screen tells the person what to do next. An error states what happened and how to fix it, without an apology and without a joke.

Write "Dishes" and "every 3 days", not "interval" or "routine entity". Groups use their catalog names: Tidy, Clean, Admin, Health, Social, Other.

## Color

Spend color on overdue and on the moment a routine is marked done. Everything else stays quiet. Groups do not get their own hues.

| token | hex | use |
|-------|-----|-----|
| wall | `#E6EEE9` | page ground, the field the grout sits in |
| tile | `#F7F8F6` | tile face, setup surface |
| grout | `#24302C` | the gap between doing tiles |
| ink | `#1A2420` | text, icons, focus outline |
| chili | `#B5453A` | overdue only: the mark and the word "Overdue" |

"Due" is ink, not a sixth color. Marking a chore done turns that tile to wall. There is no success color.

Ink on tile is about 15:1. Chili on tile is about 5.1:1, so the word "Overdue" is readable on the tile face. Do not put chili text on grout (about 2.5:1). Do not invent a sixth color for links, focus, or a second status.

The gap between doing tiles is grout, a structural line. Tiles are not floating cards and do not carry a drop shadow.

## Type

The family is not chosen. Use the system sans already in `src/styles/_variables.scss` until it is. Do not introduce a grotesque as a stand-in, and do not add a display face, a monospace face, or italics that highlight a single word.

| role | weight | size | notes |
|------|--------|------|-------|
| Tile name, button, group name | 500 | at least 1.25rem | fixed size; the tile grows, the type does not |
| Setup body | 400 | 1rem | line-height 1.5, line length under 65 characters |
| Chore name on the edit panel | 600 | about 2rem | the one large line on that screen |

Sentence case for everything except the product name. When a family is chosen, self-host one family and keep these roles.

## Marks

A category tile's mark is the catalog icon and the group name, one line, left-aligned, inset from the grout, ink, same stroke. The icon comes from `icon_key` via `getRoutineGroupIcon`. It does not scale up to fill the tile. A settled group shows that mark and no status word. "Due" is added in ink when the group is waiting and nothing is late. When anything is overdue, the whole mark turns chili and the word "Overdue" replaces "Due". See [ACCESSIBILITY.md](ACCESSIBILITY.md): color is not the only signal.

A routine tile is the chore name in ink. When it is overdue, the word "Overdue" is visible in chili. No icon on a routine tile.

Icons are the Lucide strokes already in the catalog. They are not illustrations, and they are not a different color per group.

## Leave out

- All-caps labels, tracked-out eyebrows, and middle-dot meta lines
- A gradient, a soft grey shadow, or a rounded card around every block
- A different typeface or color for one word in a heading
- Stock photography of people cleaning
- Emoji as status
