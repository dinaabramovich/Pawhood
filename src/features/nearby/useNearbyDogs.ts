import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";

import { useAuth } from "@/features/auth/AuthProvider";

import { fetchNearbyDogs, upsertMyLocation } from "./api";

export function useNearbyDogs() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ["nearby-dogs", userId],
    queryFn: async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Location access is needed to find nearby dogs.");
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, accuracy } = position.coords;

      // Refresh our own location so other users can find us too — this is
      // the only place in the app that writes to user_locations.
      await upsertMyLocation(userId as string, latitude, longitude, accuracy ?? null);

      return fetchNearbyDogs(latitude, longitude);
    },
    enabled: !!userId,
    staleTime: 60_000,
    retry: false,
  });
}
