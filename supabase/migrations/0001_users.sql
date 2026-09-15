-- Public user profiles, 1:1 with auth.users. Exact location data (for
-- "nearby dogs") deliberately lives in a separate, tightly-locked table
-- added in a later milestone — never on this one.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bio text,
  birth_year int,
  city text not null default 'Tel Aviv',
  is_banned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Any signed-in user can view basic profiles (this is a discovery app).
create policy "Profiles are viewable by authenticated users"
  on public.users
  for select
  to authenticated
  using (true);

create policy "Users can create their own profile"
  on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();
