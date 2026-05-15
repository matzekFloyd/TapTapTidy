/*
 * TapTapTidy — routine completion log (#17)
 *
 * Append-only completions; triggers keep routines.last_completed_at = MAX(completed_at).
 * Undo: DELETE a row (app should remove latest); trigger recomputes or clears denormalized field.
 */

create table public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completed_at timestamptz not null default now(),
  completed_by_user_id uuid references auth.users (id) on delete set null
);

comment on table public.routine_completions is
  'Append-only log of completions; use DELETE only for undo (recomputes last_completed_at).';

comment on column public.routine_completions.user_id is
  'Owner of the parent routine; must equal routines.user_id (enforced by trigger + RLS).';
comment on column public.routine_completions.completed_by_user_id is
  'Optional; who tapped done when it differs from owner (household flows later).';

create index routine_completions_routine_id_idx on public.routine_completions (routine_id);
create index routine_completions_routine_completed_at_idx
  on public.routine_completions (routine_id, completed_at desc);

-- Ensure user_id always matches the parent routine (API must send owner id).
create or replace function public.routine_completions_enforce_routine_owner()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.routines r
    where r.id = new.routine_id
      and r.user_id = new.user_id
  ) then
    raise exception 'routine_id must reference a routine owned by user_id';
  end if;
  return new;
end;
$$;

create trigger routine_completions_enforce_routine_owner
  before insert on public.routine_completions
  for each row
  execute function public.routine_completions_enforce_routine_owner();

-- Recompute denormalized last_completed_at from the log (handles insert, out-of-order insert, delete/undo).
create or replace function public.routine_completions_sync_last_completed_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  target_id uuid;
begin
  if tg_op = 'DELETE' then
    target_id := old.routine_id;
  else
    target_id := new.routine_id;
  end if;

  update public.routines r
  set
    last_completed_at = (
      select max(c.completed_at)
      from public.routine_completions c
      where c.routine_id = target_id
    ),
    updated_at = now()
  where r.id = target_id;

  if tg_op = 'DELETE' then
    return old;
  else
    return new;
  end if;
end;
$$;

create trigger routine_completions_sync_last_completed_after_insert
  after insert on public.routine_completions
  for each row
  execute function public.routine_completions_sync_last_completed_at();

create trigger routine_completions_sync_last_completed_after_delete
  after delete on public.routine_completions
  for each row
  execute function public.routine_completions_sync_last_completed_at();

alter table public.routine_completions enable row level security;

revoke all on table public.routine_completions from public;
revoke all on table public.routine_completions from anon;
revoke all on table public.routine_completions from authenticated;

grant select, insert, delete on table public.routine_completions to authenticated;

create policy "routine_completions_select_own_routine"
  on public.routine_completions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.routines r
      where r.id = routine_id
        and r.user_id = auth.uid()
    )
  );

create policy "routine_completions_insert_own_routine"
  on public.routine_completions
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.routines r
      where r.id = routine_id
        and r.user_id = auth.uid()
    )
    and (completed_by_user_id is null or completed_by_user_id = auth.uid())
  );

create policy "routine_completions_delete_own_routine"
  on public.routine_completions
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.routines r
      where r.id = routine_id
        and r.user_id = auth.uid()
    )
  );
