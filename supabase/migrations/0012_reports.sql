create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users (id) on delete cascade,
  target_type text not null check (target_type in ('user', 'dog', 'message', 'park')),
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'actioned', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Users can file reports"
  on public.reports
  for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "Users can view their own reports"
  on public.reports
  for select
  to authenticated
  using (auth.uid() = reporter_id);

-- No update/delete policy: reports are immutable from the client once
-- filed. Reviewing/actioning them is an admin-tooling concern with no
-- admin role in this MVP, so it's out of scope here.
