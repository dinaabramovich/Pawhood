-- Enforce blocking at the RLS/function layer, in the three places it
-- matters for unwanted contact: proximity discovery, real-time presence at
-- a park, and messaging. Browsing dogs/profiles directly is deliberately
-- left open to all authenticated users even between blocked pairs — this
-- is a discovery app, and closing that off too is a larger change than
-- this safety milestone needs; blocking here targets unwanted contact, not
-- general visibility.

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
    and not exists (
      select 1 from public.blocked_users b
      where (b.blocker_id = auth.uid() and b.blocked_id = u.id)
         or (b.blocker_id = u.id and b.blocked_id = auth.uid())
    )
  order by ST_Distance(ul.location, requester_point) asc
  limit 50;
end;
$$;

drop policy "Visits are viewable by authenticated users" on public.park_visits;

create policy "Visits are viewable by authenticated users, excluding blocks"
  on public.park_visits
  for select
  to authenticated
  using (
    not exists (
      select 1 from public.blocked_users b
      where (b.blocker_id = auth.uid() and b.blocked_id = park_visits.user_id)
         or (b.blocker_id = park_visits.user_id and b.blocked_id = auth.uid())
    )
  );

drop policy "Participants can send messages in their conversations" on public.messages;

create policy "Participants can send messages in their conversations"
  on public.messages
  for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
    )
    and not exists (
      select 1
      from public.conversation_participants other_cp
      join public.blocked_users b
        on (b.blocker_id = other_cp.user_id and b.blocked_id = auth.uid())
        or (b.blocker_id = auth.uid() and b.blocked_id = other_cp.user_id)
      where other_cp.conversation_id = messages.conversation_id
        and other_cp.user_id <> auth.uid()
    )
  );

create or replace function public.start_conversation(other_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  new_id uuid;
begin
  if other_user_id = auth.uid() then
    raise exception 'Cannot start a conversation with yourself';
  end if;

  if exists (
    select 1 from public.blocked_users b
    where (b.blocker_id = auth.uid() and b.blocked_id = other_user_id)
       or (b.blocker_id = other_user_id and b.blocked_id = auth.uid())
  ) then
    raise exception 'Cannot start a conversation with a blocked user';
  end if;

  select cp1.conversation_id into existing_id
  from public.conversation_participants cp1
  join public.conversation_participants cp2
    on cp1.conversation_id = cp2.conversation_id
  where cp1.user_id = auth.uid()
    and cp2.user_id = other_user_id
  limit 1;

  if existing_id is not null then
    return existing_id;
  end if;

  insert into public.conversations default values returning id into new_id;
  insert into public.conversation_participants (conversation_id, user_id)
  values (new_id, auth.uid()), (new_id, other_user_id);

  return new_id;
end;
$$;
