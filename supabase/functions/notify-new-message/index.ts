// Sends a push notification to the other participant(s) of a conversation
// whenever a new message is inserted.
//
// Deploy: supabase functions deploy notify-new-message
// Then, in the Supabase dashboard, add a Database Webhook (Database ->
// Webhooks) firing on INSERT to public.messages, pointing at this
// function's URL. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are available
// automatically as secrets inside every Edge Function — no extra setup.
//
// This function uses the service role key to read across
// conversation_participants/push_tokens (which are locked down by RLS for
// normal clients), so it must never be reachable except via the webhook.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type MessageRecord = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
};

Deno.serve(async (req) => {
  const payload = await req.json();
  const message = payload.record as MessageRecord;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const [{ data: participants }, { data: sender }] = await Promise.all([
    supabase
      .from("conversation_participants")
      .select("user_id")
      .eq("conversation_id", message.conversation_id)
      .neq("user_id", message.sender_id),
    supabase.from("users").select("display_name").eq("id", message.sender_id).single(),
  ]);

  if (!participants || participants.length === 0) {
    return new Response("ok", { status: 200 });
  }

  const recipientIds = participants.map((participant) => participant.user_id);
  const { data: tokens } = await supabase
    .from("push_tokens")
    .select("token")
    .in("user_id", recipientIds);

  if (!tokens || tokens.length === 0) {
    return new Response("ok", { status: 200 });
  }

  const senderName = sender?.display_name ?? "Someone";

  const notifications = tokens.map((row) => ({
    to: row.token,
    title: senderName,
    body: message.body,
    data: { conversationId: message.conversation_id },
  }));

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(notifications),
  });

  return new Response("ok", { status: 200 });
});
