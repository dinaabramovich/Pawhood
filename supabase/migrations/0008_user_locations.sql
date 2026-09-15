-- Precise per-user location. This table intentionally has no "viewable by
-- authenticated users" policy anywhere — unlike every other table in this
-- schema, other users can NEVER read it directly. Only the owning row's
-- user, and SECURITY DEFINER functions (see nearby_dogs below), can see it.
create table public.user_locations (
  user_id uuid primary key references public.users (id) on delete cascade,
  location geography(point, 4326) not null,
  accuracy_m double precision,
  updated_at timestamptz not null default now()
);

alter table public.user_locations enable row level security;

create policy "Users can view their own location"
  on public.user_locations
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can set their own location"
  on public.user_locations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own location"
  on public.user_locations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger user_locations_set_updated_at
  before update on public.user_locations
  for each row
  execute function public.set_updated_at();
