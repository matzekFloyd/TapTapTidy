# TapTapTidy interface

Agreed direction for the product UI. The app is not built to this yet. Color, type, and voice live in [BRAND.md](BRAND.md). Disability access lives in [ACCESSIBILITY.md](ACCESSIBILITY.md). When those disagree with a visual choice here, the accessibility document wins. Land the brand tokens in `src/styles/_variables.scss` rather than inventing a second palette.

The job of the app: open the phone, see which chores are waiting, tap one clear. People use it standing up, often with one hand. Setup happens on purpose, usually while sitting down.

## Two views

**Doing** marks chores done. **Setup** adds, renames, reschedules, moves, and archives them. A person chooses Setup. A tap on the doing grid never edits.

The two views must look different. Doing is the only full-bleed tile surface. Setup is a quiet, left-aligned, one-column layout except when it reuses the group grid to pick a group.

## Two levels

A **group**, then a **routine**. That is the whole depth.

Groups are the fixed catalog in `routine_groups` / `ROUTINE_GROUP_CATALOG`, in this order:

| id | name | icon (`icon_key`) | what it is |
|----|------|-------------------|------------|
| `tidy` | Tidy | `layout-grid` | Put things away, reset surfaces |
| `clean` | Clean | `sparkles` | Vacuum, mop, bathroom, sheets |
| `admin` | Admin | `clipboard-list` | Bills, paperwork, subscriptions |
| `health` | Health | `heart-pulse` | Movement, sleep, check-ins |
| `social` | Social | `users` | People, family, pets |
| `other` | Other | `shapes` | Whatever does not fit |

People choose a group for a chore. They do not add, rename, delete, or nest groups.

Routines are the user's rows in `routines`: a title, an optional description, `interval_days`, and one `group_id`. `archived_at` hides a routine from both views and keeps its completion history. `last_completed_at` is maintained by the completions trigger.

## The frame

The app is one column, at most 27.5rem wide, filling the viewport height inside the safe areas. On a phone the column is the screen. On a wider window the wall color fills the space around the column. The column does not grow to fill a monitor, and tiles do not become posters.

A thin strip sits at the top of the column. It holds the view's heading, Back when there is a previous view, and Setup while you are in Doing. The grid or the list fills the rest of the column. Back and Setup are controls in the strip, not tiles.

## Doing

The grid fills the column below the strip. Tiles share that rectangle. Gaps are grout, not card margins. Tiles do not shrink until their labels fail.

How many tiles there are decides the split. Portrait is shown; landscape swaps the axes (six groups become 3×2).

```
1          2              3–4            5–6
┌────────┐ ┌─────┬─────┐ ┌─────┬─────┐ ┌─────┬─────┐
│        │ │     │     │ │     │     │ │     │     │
│        │ │     │     │ ├─────┴─────┤ ├─────┼─────┤
│        │ ├─────┴─────┤ │           │ │     │     │
│        │ │           │ │           │ ├─────┼─────┤
└────────┘ └───────────┘ └───────────┘ │     │     │
                                       └─────┴─────┘
```

An odd count gives the last tile the full width of its row, so the screen has no empty cell. Past six routines in one group, tiles stop shrinking at about a thumb's height and further rows continue below. Every row still spans the width.

Home is the six groups. A category tile's mark is its catalog icon and its name. No due count and no description. Every group is in one of three states:

| state | when | mark | word on the tile |
|-------|------|------|------------------|
| Settled | nothing waiting | ink | none |
| Due | waiting, and nothing overdue | ink | Due |
| Overdue | anything overdue | chili | Overdue |

Settled is the third state. The tile is still there and still opens; it simply has no status word. A word on every quiet room would make a finished house look as loud as a waiting one. "Overdue" wins over "Due". Due and Overdue are visible words on the enamel, so those two states are not carried by color alone.

```
┌──────────────┬──────────────┐
│ ▦ Tidy       │ ✦ Clean      │
│              │              │
├──────────────┼──────────────┤
│ ▤ Admin      │ ♥ Health     │
│              │              │
├──────────────┼──────────────┤
│ ☺ Social     │ ◇ Other      │
│              │              │
└──────────────┴──────────────┘
```

The mark is left-aligned, inset from the grout, and a fixed size. A larger tile grows as empty enamel around that mark; the icon does not become a giant launcher glyph. Icon and name sit on one line, the same ink, the same stroke. Draw the icon from `icon_key` with `getRoutineGroupIcon`. An unknown key falls back to `shapes`.

The tile stays tappable in every state. Opening a group is the one transition: that tile expands and its waiting routines become the new grid. Back collapses to the group. Routines do not open another grid.

A group tile opens. A routine tile is the chore name alone, with no icon, plus the word "Overdue" when it is overdue. Being on the grid already means it is due, so a routine tile does not also say "Due".

Waiting routines are ordered overdue first, then due. Within each of those, older `created_at` comes first. That order does not shuffle when a tile leaves.

The tap counts on the button's click: the pointer releases inside the tile, or Enter or Space on the focused button. A press that slides away does not mark the chore done.

Marking done turns that tile's face to the wall color, then the tile leaves and the ones that remain grow to fill the column. No separate success color. The last routine in view owns the column below the strip. Undo is one action, available immediately, and uses the same verb in reverse ("Undo" restores the routine that was just marked done).

Inside a group, the grid shows routines that are due or overdue. Resting routines sit in a quieter "Not yet" set and do not compete with the tiles. A resting routine is still a button: the same click marks it done. When nothing is due, the column is one panel that says so and offers Setup.

A whole-day interval is a local calendar day, not a rolling 24 hours. "Every day" finished this morning waits until tomorrow in the person's local timezone. A routine with no completion is due. Groups are not color-coded. Chili means overdue only.

## Setup

Setup opens from the strip in Doing, including from the empty state. It uses the same column. The strip's heading is "Setup", then the group name inside a group, and Back returns to where you came from. There is no Setup control on Setup itself. Each category tile is the same mark as on Doing home, including "Due" or "Overdue" when that state is true. The chore count lives in the list you open, not on the tile.

Tapping a group opens a list of those routines. Each row shows the name and the interval in plain language ("every day", "every 3 days", "every week"). This list is for reading and editing. It does not mark anything done.

Adding or editing one routine takes over the column as a single panel. The group is already chosen. The panel asks for the name and how often. Presets are every day, every 3 days, and every week; a number of days covers the rest. That value is `interval_days`. Description stays collapsed until the person asks for it. Moving a routine is changing its group, not nesting it. The archive action sets `archived_at`.

An empty group says "No chores in Clean yet" (using that group's name) and offers "Add a chore." The same path is the first screen when the person has no routines.

## Visual

Color, type, and voice are in [BRAND.md](BRAND.md). The gap between doing tiles is grout: a structural line. Tiles are not floating cards, and they do not carry a soft drop shadow. Setup uses the same colors, left aligned, in one column. The routine name is the large type on the edit panel.

## Motion

Motion answers the person. Opening a group expands that tile into the routine grid. Marking done turns the tile to the wall color, then the remaining tiles expand. With reduced motion, the grid updates in place. Keyboard, screen reader, focus, and the visible "Due" and "Overdue" words are specified in [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Leave out

- User-defined, renamed, or nested groups
- A third level of panels
- Editing, intervals, or archive controls on doing tiles
- A separate category-manager screen
- A different hue per group
- A due count or description on a category tile ("Due" and "Overdue" are required when those states are true; "Overdue" wins)
- A category icon that scales up to fill its tile
- A success color for marking done (the tile turns to the wall color)
- Stretching the column to fill a wide monitor
- Hour-level intervals in the form (the column allows fractions later; the UI starts in local calendar days)
