import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase/client";
import type { MessagesRow } from "@/lib/supabase/types";

import { listMessages } from "./api";

export function messagesQueryKey(conversationId: string | undefined) {
  return ["messages", conversationId] as const;
}

export function useMessages(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = messagesQueryKey(conversationId);

  const query = useQuery({
    queryKey,
    queryFn: () => listMessages(conversationId as string),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as MessagesRow;
          queryClient.setQueryData<MessagesRow[]>(queryKey, (current) => {
            if (!current) return [newMessage];
            if (current.some((message) => message.id === newMessage.id)) return current;
            return [...current, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return query;
}
