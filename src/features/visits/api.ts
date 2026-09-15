import { supabase } from "@/lib/supabase/client";
import type { ParkVisitsRow } from "@/lib/supabase/types";

// Our hand-written Database type doesn't model FK relationships (that
// metadata only exists once types are generated from a live project), so
// PostgREST's embedded-resource result below isn't type-checked — cast it.
export type VisitWithDetails = ParkVisitsRow & {
  users: { display_name: string; avatar_url: string | null } | null;
  visit_dogs: { dogs: { id: string; name: string; photo_urls: string[] } | null }[];
};

const VISIT_WINDOW_HOURS_PAST = 2;

export async function listUpcomingVisits(parkId: string): Promise<VisitWithDetails[]> {
  const cutoff = new Date(Date.now() - VISIT_WINDOW_HOURS_PAST * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("park_visits")
    .select("*, users(display_name, avatar_url), visit_dogs(dogs(id, name, photo_urls))")
    .eq("park_id", parkId)
    .gte("visit_time", cutoff)
    .order("visit_time", { ascending: true });
  if (error) throw error;
  return data as unknown as VisitWithDetails[];
}

export async function createVisit(
  userId: string,
  parkId: string,
  visitTime: string,
  dogIds: string[],
): Promise<void> {
  const { data: visit, error } = await supabase
    .from("park_visits")
    .insert({ user_id: userId, park_id: parkId, visit_time: visitTime })
    .select()
    .single();
  if (error) throw error;

  if (dogIds.length > 0) {
    const { error: dogsError } = await supabase
      .from("visit_dogs")
      .insert(dogIds.map((dogId) => ({ visit_id: visit.id, dog_id: dogId })));
    if (dogsError) throw dogsError;
  }
}

export async function cancelVisit(visitId: string): Promise<void> {
  const { error } = await supabase.from("park_visits").delete().eq("id", visitId);
  if (error) throw error;
}
