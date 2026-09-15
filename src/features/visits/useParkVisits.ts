import { useQuery } from "@tanstack/react-query";

import { listUpcomingVisits } from "./api";

export function visitsQueryKey(parkId: string | undefined) {
  return ["park-visits", parkId] as const;
}

export function useParkVisits(parkId: string | undefined) {
  return useQuery({
    queryKey: visitsQueryKey(parkId),
    queryFn: () => listUpcomingVisits(parkId as string),
    enabled: !!parkId,
  });
}
