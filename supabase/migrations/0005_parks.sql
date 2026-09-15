-- Requires PostGIS. Supabase projects have it available; this just makes
-- sure it's enabled.
create extension if not exists postgis with schema extensions;

-- Parks are curated (seeded via SQL / the dashboard), not user-created, so
-- there's deliberately no insert/update policy for the authenticated role.
create table public.parks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location geography(point, 4326) not null,
  -- Plain lat/lng columns derived from location, so clients never have to
  -- parse PostGIS's geography wire format.
  lat double precision generated always as (ST_Y(location::geometry)) stored,
  lng double precision generated always as (ST_X(location::geometry)) stored,
  address text,
  amenities jsonb not null default '{}'::jsonb,
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.parks enable row level security;

create policy "Parks are viewable by authenticated users"
  on public.parks
  for select
  to authenticated
  using (true);

create trigger parks_set_updated_at
  before update on public.parks
  for each row
  execute function public.set_updated_at();
