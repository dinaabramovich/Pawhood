import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";

import { listMyDogs } from "./api";

export function dogsQueryKey(ownerId: string | undefined) {
  return ["dogs", ownerId] as const;
}

export function useMyDogs() {
  const { session } = useAuth();
  const ownerId = session?.user.id;

  return useQuery({
    queryKey: dogsQueryKey(ownerId),
    queryFn: () => listMyDogs(ownerId as string),
    enabled: !!ownerId,
  });
}
