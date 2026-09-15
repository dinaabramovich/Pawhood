import { useQuery } from "@tanstack/react-query";

import { getDog } from "./api";

export function dogQueryKey(dogId: string | undefined) {
  return ["dog", dogId] as const;
}

export function useDog(dogId: string | undefined) {
  return useQuery({
    queryKey: dogQueryKey(dogId),
    queryFn: () => getDog(dogId as string),
    enabled: !!dogId,
  });
}
