import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";

import { unblockUser } from "./api";
import { blockedUsersQueryKey } from "./useBlockedUsers";

export function useUnblockUser() {
  const { session } = useAuth();
  const userId = session?.user.id as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blockedId: string) => unblockUser(userId, blockedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedUsersQueryKey(userId) });
    },
  });
}
