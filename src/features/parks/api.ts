import { supabase } from "@/lib/supabase/client";
import type { ParksRow } from "@/lib/supabase/types";

export async function listParks(): Promise<ParksRow[]> {
  const { data, error } = await supabase.from("parks").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getPark(parkId: string): Promise<ParksRow | null> {
  const { data, error } = await supabase.from("parks").select("*").eq("id", parkId).maybeSingle();
  if (error) throw error;
  return data;
}
