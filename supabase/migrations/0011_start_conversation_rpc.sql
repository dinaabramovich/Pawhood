-- The only way a conversation gets created: finds the existing 1:1
-- conversation between the caller and other_user_id, or creates one.
-- SECURITY DEFINER because conversations/conversation_participants have no
-- client-facing insert policy — this function is the sole writer.
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

revoke all on function public.start_conversation(uuid) from public;
grant execute on function public.start_conversation(uuid) to authenticated;
