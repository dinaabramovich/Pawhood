import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";

import { getMyProfile } from "./api";

export function profileQueryKey(userId: string | undefined) {
  return ["profile", userId] as const;
}

export function useMyProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: profileQueryKey(userId),
    queryFn: () => getMyProfile(userId as string),
    enabled: !!userId,
  });
}
