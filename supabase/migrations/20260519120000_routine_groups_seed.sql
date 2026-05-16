/*
 * TapTapTidy — seed routine_groups catalog (A2)
 *
 * Adding or changing a group: add a new migration with INSERT ... ON CONFLICT (id)
 * DO UPDATE on these columns. If icon_key changes, update the whitelist in
 * src/lib/routine-group-icons.ts and add @lucide/svelte imports as needed.
 */

insert into public.routine_groups (id, name, description, icon_key)
values
  (
    'tidy',
    'Tidy',
    'Put things away, reset surfaces, quick home order.',
    'layout-grid'
  ),
  (
    'clean',
    'Clean',
    'Vacuum, mop, bathroom, sheets, deeper cleaning.',
    'sparkles'
  ),
  (
    'admin',
    'Admin',
    'Bills, budget, taxes, subscriptions, life paperwork.',
    'clipboard-list'
  ),
  (
    'health',
    'Health',
    'Gym, sport, movement, sleep, recovery, check-ins.',
    'heart-pulse'
  ),
  (
    'social',
    'Social',
    'Recurring people time, family/kids/pets, social upkeep.',
    'users'
  ),
  (
    'other',
    'Other',
    'Car, gear, seasonal, anything that does not fit above.',
    'shapes'
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon_key = excluded.icon_key,
  updated_at = now();
