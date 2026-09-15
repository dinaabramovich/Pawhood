import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";
import type { MessagesRow } from "@/lib/supabase/types";

import { sendMessage } from "./api";
import { conversationsQueryKey } from "./useConversations";
import { messagesQueryKey } from "./useMessages";

export function useSendMessage(conversationId: string) {
  const { session } = useAuth();
  const userId = session?.user.id as string;
  const queryClient = useQueryClient();
  const queryKey = messagesQueryKey(conversationId);

  return useMutation({
    mutationFn: (body: string) => sendMessage(conversationId, userId, body),
    onSuccess: (message) => {
      queryClient.setQueryData<MessagesRow[]>(queryKey, (current) =>
        current ? [...current, message] : [message],
      );
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey(userId) });
    },
  });
}
