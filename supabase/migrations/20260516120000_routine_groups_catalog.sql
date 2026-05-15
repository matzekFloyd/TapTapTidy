/*
 * TapTapTidy — routine_groups catalog (#13)
 *
 * App-defined routine categories. Rows are inserted/updated only via migrations
 * (or service_role). Authenticated users read via RLS; no client-side mutations.
 *
 * Future public.routines.group_id should reference public.routine_groups (id).
 */

create table public.routine_groups (
  id text primary key,
  name text not null,
  description text,
  icon_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.routine_groups is
  'Catalog of routine groups; seed via migrations. End users never insert/update/delete.';

comment on column public.routine_groups.id is
  'Stable slug or uuid matching product catalog.';
comment on column public.routine_groups.icon_key is
  'Optional; only if icons are chosen from DB. Otherwise map icons by id in the app.';

alter table public.routine_groups enable row level security;

-- Tighten table privileges: API roles only get what we grant explicitly.
revoke all on table public.routine_groups from public;
revoke all on table public.routine_groups from anon;
revoke all on table public.routine_groups from authenticated;

grant select on table public.routine_groups to authenticated;

create policy "routine_groups_select_authenticated"
  on public.routine_groups
  for select
  to authenticated
  using (true);

-- No insert / update / delete policies for authenticated → denied by RLS.
