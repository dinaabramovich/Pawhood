create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  breed text,
  birth_date date,
  size text check (size in ('small', 'medium', 'large')),
  gender text check (gender in ('male', 'female')),
  energy_level text check (energy_level in ('low', 'medium', 'high')),
  bio text,
  photo_urls text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dogs enable row level security;

-- Any signed-in user can browse dogs (this is a discovery app).
create policy "Dogs are viewable by authenticated users"
  on public.dogs
  for select
  to authenticated
  using (true);

create policy "Owners can create their own dogs"
  on public.dogs
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Owners can update their own dogs"
  on public.dogs
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Reuses the trigger function defined in 0001_users.sql.
create trigger dogs_set_updated_at
  before update on public.dogs
  for each row
  execute function public.set_updated_at();
