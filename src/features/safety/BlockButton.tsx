import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { Button } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import { conversationsQueryKey } from "@/features/messaging/useConversations";
import { spacing } from "@/theme/tokens";

import { blockUser } from "./api";
import { blockedUsersQueryKey } from "./useBlockedUsers";

type BlockButtonProps = {
  targetUserId: string;
  targetName: string;
  onBlocked?: () => void;
};

export function BlockButton({ targetUserId, targetName, onBlocked }: BlockButtonProps) {
  const { session } = useAuth();
  const userId = session?.user.id as string;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => blockUser(userId, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedUsersQueryKey(userId) });
      queryClient.invalidateQueries({ queryKey: ["nearby-dogs", userId] });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey(userId) });
      onBlocked?.();
    },
    onError: (err) => {
      Alert.alert("Couldn't block", err instanceof Error ? err.message : "Try again.");
    },
  });

  function confirmBlock() {
    Alert.alert(
      `Block ${targetName}?`,
      "They won't be able to message you, and you won't see each other in nearby dogs or park visits.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Block", style: "destructive", onPress: () => mutation.mutate() },
      ],
    );
  }

  return (
    <Button
      label="Block"
      variant="ghost"
      loading={mutation.isPending}
      onPress={confirmBlock}
      style={{ marginTop: spacing.sm }}
    />
  );
}
