import { useQuery } from "@tanstack/react-query";

import { getPark } from "./api";

export function parkQueryKey(parkId: string | undefined) {
  return ["park", parkId] as const;
}

export function usePark(parkId: string | undefined) {
  return useQuery({
    queryKey: parkQueryKey(parkId),
    queryFn: () => getPark(parkId as string),
    enabled: !!parkId,
  });
}
