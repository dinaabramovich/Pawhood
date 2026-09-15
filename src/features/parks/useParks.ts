import { useQuery } from "@tanstack/react-query";

import { listParks } from "./api";

export function useParks() {
  return useQuery({
    queryKey: ["parks"],
    queryFn: listParks,
    staleTime: 5 * 60_000,
  });
}
