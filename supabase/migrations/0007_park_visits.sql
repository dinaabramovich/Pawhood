-- "I'm going" — a user marking themselves (and, implicitly, their dogs) as
-- headed to a park at a given time. No status/edit flow in this MVP:
-- canceling just deletes the row.
create table public.park_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  park_id uuid not null references public.parks (id) on delete cascade,
  visit_time timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, park_id, visit_time)
);

alter table public.park_visits enable row level security;

-- Visible to any signed-in user — this is the "who's going" feature.
create policy "Visits are viewable by authenticated users"
  on public.park_visits
  for select
  to authenticated
  using (true);

create policy "Users can create their own visits"
  on public.park_visits
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can cancel their own visits"
  on public.park_visits
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Which of the visiting user's dogs are coming along.
create table public.visit_dogs (
  visit_id uuid not null references public.park_visits (id) on delete cascade,
  dog_id uuid not null references public.dogs (id) on delete cascade,
  primary key (visit_id, dog_id)
);

alter table public.visit_dogs enable row level security;

create policy "Visit dogs are viewable by authenticated users"
  on public.visit_dogs
  for select
  to authenticated
  using (true);

create policy "Users can add their own dogs to their own visits"
  on public.visit_dogs
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.park_visits v
      where v.id = visit_id and v.user_id = auth.uid()
    )
    and exists (
      select 1 from public.dogs d
      where d.id = dog_id and d.owner_id = auth.uid()
    )
  );

create policy "Users can remove dogs from their own visits"
  on public.visit_dogs
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.park_visits v
      where v.id = visit_id and v.user_id = auth.uid()
    )
  );
