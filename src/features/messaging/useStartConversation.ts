import { useMutation } from "@tanstack/react-query";

import { startConversation } from "./api";

export function useStartConversation() {
  return useMutation({
    mutationFn: (otherUserId: string) => startConversation(otherUserId),
  });
}
