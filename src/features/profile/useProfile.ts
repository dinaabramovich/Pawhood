import { useQuery } from "@tanstack/react-query";

import { getMyProfile } from "./api";

export function profileByIdQueryKey(userId: string | undefined) {
  return ["profile-by-id", userId] as const;
}

// Despite the name, getMyProfile just fetches a profile by id — this hook
// reuses it for viewing anyone's profile, not only the signed-in user's.
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileByIdQueryKey(userId),
    queryFn: () => getMyProfile(userId as string),
    enabled: !!userId,
  });
}
