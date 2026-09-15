import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";

import { listMyConversations } from "./api";

export function conversationsQueryKey(userId: string | undefined) {
  return ["conversations", userId] as const;
}

export function useConversations() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: conversationsQueryKey(userId),
    queryFn: () => listMyConversations(userId as string),
    enabled: !!userId,
  });
}
