import { supabase } from "@/lib/supabase/client";
import type { NearbyDog } from "@/lib/supabase/types";

export async function upsertMyLocation(
  userId: string,
  lat: number,
  lng: number,
  accuracyM: number | null,
): Promise<void> {
  const { error } = await supabase.from("user_locations").upsert({
    user_id: userId,
    location: `SRID=4326;POINT(${lng} ${lat})`,
    accuracy_m: accuracyM,
  });
  if (error) throw error;
}

export async function fetchNearbyDogs(
  lat: number,
  lng: number,
  radiusMeters = 5000,
): Promise<NearbyDog[]> {
  const { data, error } = await supabase.rpc("nearby_dogs", {
    requester_lat: lat,
    requester_lng: lng,
    radius_meters: radiusMeters,
  });
  if (error) throw error;
  return data ?? [];
}
