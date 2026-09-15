import { supabase } from "@/lib/supabase/client";
import type { MessagesRow } from "@/lib/supabase/types";

export type ConversationSummary = {
  id: string;
  last_message_at: string;
  other_user: { id: string; display_name: string; avatar_url: string | null };
  last_message_preview: string | null;
};

// Built from a few simple queries rather than one deeply nested PostgREST
// embed — easier to reason about, and each step is easy to verify.
export async function listMyConversations(userId: string): Promise<ConversationSummary[]> {
  const { data: memberships, error: membershipsError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);
  if (membershipsError) throw membershipsError;

  const conversationIds = memberships.map((membership) => membership.conversation_id);
  if (conversationIds.length === 0) return [];

  const { data: conversations, error: conversationsError } = await supabase
    .from("conversations")
    .select("id, last_message_at")
    .in("id", conversationIds)
    .order("last_message_at", { ascending: false });
  if (conversationsError) throw conversationsError;

  const { data: otherParticipants, error: participantsError } = await supabase
    .from("conversation_participants")
    .select("conversation_id, users(id, display_name, avatar_url)")
    .in("conversation_id", conversationIds)
    .neq("user_id", userId);
  if (participantsError) throw participantsError;

  const { data: recentMessages, error: messagesError } = await supabase
    .from("messages")
    .select("conversation_id, body, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });
  if (messagesError) throw messagesError;

  const otherUserByConversation = new Map(
    otherParticipants.map((participant) => [
      participant.conversation_id,
      participant.users as unknown as {
        id: string;
        display_name: string;
        avatar_url: string | null;
      },
    ]),
  );

  const lastMessageByConversation = new Map<string, string>();
  for (const message of recentMessages) {
    if (!lastMessageByConversation.has(message.conversation_id)) {
      lastMessageByConversation.set(message.conversation_id, message.body);
    }
  }

  return conversations.map((conversation) => ({
    id: conversation.id,
    last_message_at: conversation.last_message_at,
    other_user: otherUserByConversation.get(conversation.id) ?? {
      id: "",
      display_name: "Someone",
      avatar_url: null,
    },
    last_message_preview: lastMessageByConversation.get(conversation.id) ?? null,
  }));
}

export async function listMessages(conversationId: string): Promise<MessagesRow[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<MessagesRow> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function startConversation(otherUserId: string): Promise<string> {
  const { data, error } = await supabase.rpc("start_conversation", {
    other_user_id: otherUserId,
  });
  if (error) throw error;
  return data;
}
