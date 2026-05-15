/*
 * TapTapTidy — user routines (#15)
 *
 * User-owned recurring items; group_id points at the read-only catalog.
 * RLS: each user can only read/write rows where user_id = auth.uid().
 */

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  group_id text not null references public.routine_groups (id) on delete restrict,
  title text not null,
  description text,
  interval_days numeric not null,
  last_completed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint routines_interval_days_positive check (interval_days > 0)
);

comment on table public.routines is
  'User-owned routines; completions table (if any) maintains last_completed_at.';

comment on column public.routines.interval_days is
  'How often the routine should be done; may be fractional (sub-day) for hour logic.';
comment on column public.routines.last_completed_at is
  'Denormalized latest completion instant; UTC.';

create index routines_user_id_idx on public.routines (user_id);
create index routines_user_id_group_id_idx on public.routines (user_id, group_id);

alter table public.routines enable row level security;

revoke all on table public.routines from public;
revoke all on table public.routines from anon;
revoke all on table public.routines from authenticated;

grant select, insert, update, delete on table public.routines to authenticated;

create policy "routines_select_own"
  on public.routines
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "routines_insert_own"
  on public.routines
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "routines_update_own"
  on public.routines
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "routines_delete_own"
  on public.routines
  for delete
  to authenticated
  using (user_id = auth.uid());
