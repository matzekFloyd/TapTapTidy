# Accessibility

This is the disability-access standard for TapTapTidy. The desktop web app has to be fully usable with a keyboard and a screen reader before a screen is done. Android and iOS are later, and they have to meet the same outcomes with the platform's own accessibility tools. Build the web UI with real controls and visible text now so those apps are not a retrofit.

The floor is WCAG 2.2 AA for the web app. [BRAND.md](BRAND.md) owns color and type. [DESIGN.md](DESIGN.md) owns the grid and the two views. Where a visual choice and this document disagree, this document wins.

## Desktop, now

People using a mouse are not the only desktop users. Everything in Doing and Setup has to work with a keyboard alone, and with a screen reader (Narrator or NVDA on Windows). Hover cannot be the only way to see or reach an action. Focus has to be visible. Check both before calling a screen done.

## Keyboard

Every tile, row, and form control is a native `button`, `a`, or form field in the tab order. Do not use a clickable `div`.

Tab and Shift+Tab move through the page in visual order, row by row: header actions, then each tile or row, then Undo if it is present. Enter and Space activate the focused control. Escape goes back: from a group's routines to that group tile, from a group's chore list to the setup grid, from the edit panel to the chore it came from. Focus returns to the control that opened the view.

Arrow keys may also move inside the doing grid. They are an extra. They do not replace Tab, and they do not remove tiles from the tab order.

No keyboard trap. A person can always Tab away, or Escape back. The edit panel is a view with its own heading, not a dialog that swallows the page.

Visible actions stay visible. Edit and Archive are buttons in the setup list, present without a hover. Name them with the chore ("Edit Dishes", "Archive Dishes") so repeated controls are distinguishable.

## Screen readers

Use the control's visible text as its accessible name. Do not add an `aria-label` that repeats or drifts from that text.

- A category tile reads as its name. The icon is `aria-hidden`. The visible state word is part of the name: "Clean", "Clean, due", or "Clean, overdue".
- A routine tile reads as the chore name, and "Dishes, overdue" when it is overdue. Waiting routines are read overdue first, then due, older `created_at` first within each. That is also the tab order.
- One `h1` per view. Doing home uses "TapTapTidy". Inside a group, the `h1` is the group name. Setup uses "Setup", then the group name inside a group. Tiles are not headings.
- Marking done announces "Dishes marked done" in a polite live region. Undo announces "Dishes restored". Then move focus to the next routine, or to the empty-state action if none remain. Do not move focus onto the live region itself.
- "Not yet" is a heading and a list in the tab order, not a disclosure that only a pointer can open.
- The page `lang` stays `en` on `html` until the product is translated.

## Seeing and understanding

"Due" and "Overdue" are never color alone. Both words are visible on the tile face (`#F7F8F6`). "Due" is ink, about 15:1. "Overdue" is chili, about 5.1:1, and chili also turns the category mark. Do not put chili text on grout.

Focus uses the `focus-ring` mixin: a 2px solid ink outline with offset, on top of the tile, including in Windows forced-colors mode. The leftover blue accent is not the focus color. Do not remove the outline.

The doing tiles are the targets. Setup rows and fields are at least 44px tall. At 200% zoom the grid may collapse toward a single column and still has to work, without a horizontal page scroll. Line length for setup text stays under 65 characters.

Respect `prefers-reduced-motion`: opening a group and marking done update the grid in place, with no expand or fill. The change is still announced.

## Setup fields

Every field has a visible label tied to the input. Placeholder text is not the label. An error names the field and the fix ("Dishes needs a name"), sets `aria-invalid`, and is referenced with `aria-describedby`. On a failed save, move focus to the first invalid field.

## Android and iOS, later

The same names, order, and actions have to be exposed to VoiceOver, TalkBack, and a hardware keyboard. Tiles need real accessibility nodes, not only drawn rectangles. Support dynamic type, reduce motion, and targets of at least 44pt. Do not add a gesture that has no button equivalent.

## Before a screen is done

- Use the screen with the keyboard only: open a group, mark a chore done, undo it, open Setup, add a chore, archive one, and get back.
- Use it again with Narrator or NVDA and confirm each tile's name and the "marked done" announcement.
- Confirm overdue is still obvious with color ignored: the word "Overdue" is on the tile.
- Confirm focus is visible, Escape returns to the control that opened the view, and reduced motion leaves the grid in place.
