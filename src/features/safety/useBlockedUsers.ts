import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";

import { listMyBlocks } from "./api";

export function blockedUsersQueryKey(userId: string | undefined) {
  return ["blocked-users", userId] as const;
}

export function useBlockedUsers() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: blockedUsersQueryKey(userId),
    queryFn: () => listMyBlocks(userId as string),
    enabled: !!userId,
  });
}
