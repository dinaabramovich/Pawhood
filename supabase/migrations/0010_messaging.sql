-- Basic 1:1 messaging. conversation_participants is a junction table (not
-- just a 1:1 column pair) so group chats can be added later without a
-- schema change — this MVP only ever creates 2-participant conversations,
-- via the start_conversation() RPC in the next migration.
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  primary key (conversation_id, user_id)
);

alter table public.conversation_participants enable row level security;

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  deleted_at timestamptz
);

alter table public.messages enable row level security;

-- Neither conversations nor conversation_participants has an insert policy:
-- both are only ever written by the SECURITY DEFINER start_conversation()
-- RPC (next migration), never directly by a client.
create policy "Participants can view their conversation memberships"
  on public.conversation_participants
  for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversation_participants.conversation_id
        and cp.user_id = auth.uid()
    )
  );

create policy "Participants can view their conversations"
  on public.conversations
  for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversations.id and cp.user_id = auth.uid()
    )
  );

create policy "Participants can view messages in their conversations"
  on public.messages
  for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
    )
  );

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
  );

-- No update/delete policy on messages in this MVP (no edit, unsend, or read
-- receipts yet) — an RLS policy allowing "update read_at" can't be scoped
-- to that one column, so it's left out entirely until it's actually needed.

create function public.touch_conversation_last_message()
returns trigger as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger messages_touch_conversation
  after insert on public.messages
  for each row
  execute function public.touch_conversation_last_message();

alter publication supabase_realtime add table public.messages;
