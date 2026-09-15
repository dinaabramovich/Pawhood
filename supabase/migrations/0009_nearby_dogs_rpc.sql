-- The only way any client ever learns about another user's location.
-- SECURITY DEFINER lets this function read user_locations (which has no
-- policy granting that to other users), but it never returns coordinates
-- for anyone but the caller — only a coarse distance band. The caller's
-- own coordinates are supplied as parameters (fresh from the device each
-- call), not read from the table.
create or replace function public.nearby_dogs(
  requester_lat double precision,
  requester_lng double precision,
  radius_meters integer default 5000
)
returns table (
  dog_id uuid,
  dog_name text,
  dog_photo_url text,
  owner_display_name text,
  owner_avatar_url text,
  distance_band text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  requester_point geography;
begin
  requester_point := ST_SetSRID(ST_MakePoint(requester_lng, requester_lat), 4326)::geography;

  return query
  select
    d.id,
    d.name,
    d.photo_urls[1],
    u.display_name,
    u.avatar_url,
    case
      when ST_Distance(ul.location, requester_point) < 250 then 'Under 250 m'
      when ST_Distance(ul.location, requester_point) < 500 then '250-500 m'
      when ST_Distance(ul.location, requester_point) < 1000 then '500 m-1 km'
      when ST_Distance(ul.location, requester_point) < 3000 then '1-3 km'
      else '3 km+'
    end
  from public.user_locations ul
  join public.users u on u.id = ul.user_id
  join public.dogs d on d.owner_id = u.id and d.is_active = true
  where ul.user_id <> auth.uid()
    and u.is_banned = false
    and ST_DWithin(ul.location, requester_point, radius_meters)
  order by ST_Distance(ul.location, requester_point) asc
  limit 50;
end;
$$;

revoke all on function public.nearby_dogs(double precision, double precision, integer) from public;
grant execute on function public.nearby_dogs(double precision, double precision, integer) to authenticated;
