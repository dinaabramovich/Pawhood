create table public.blocked_users (
  blocker_id uuid not null references public.users (id) on delete cascade,
  blocked_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

alter table public.blocked_users enable row level security;

create policy "Users can view their own blocks"
  on public.blocked_users
  for select
  to authenticated
  using (auth.uid() = blocker_id);

create policy "Users can block others"
  on public.blocked_users
  for insert
  to authenticated
  with check (auth.uid() = blocker_id);

create policy "Users can unblock"
  on public.blocked_users
  for delete
  to authenticated
  using (auth.uid() = blocker_id);
