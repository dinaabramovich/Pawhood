import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";

import { getOtherParticipant } from "./api";

export function useOtherParticipant(conversationId: string | undefined) {
  const { session } = useAuth();
  const myUserId = session?.user.id;

  return useQuery({
    queryKey: ["conversation-other-participant", conversationId, myUserId],
    queryFn: () => getOtherParticipant(conversationId as string, myUserId as string),
    enabled: !!conversationId && !!myUserId,
  });
}
