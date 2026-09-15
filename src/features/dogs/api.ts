import { supabase } from "@/lib/supabase/client";
import type { DogsInsert, DogsRow, DogsUpdate } from "@/lib/supabase/types";

export async function listMyDogs(ownerId: string): Promise<DogsRow[]> {
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getDog(dogId: string): Promise<DogsRow | null> {
  const { data, error } = await supabase.from("dogs").select("*").eq("id", dogId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createDog(input: DogsInsert): Promise<DogsRow> {
  const { data, error } = await supabase.from("dogs").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateDog(dogId: string, input: DogsUpdate): Promise<DogsRow> {
  const { data, error } = await supabase
    .from("dogs")
    .update(input)
    .eq("id", dogId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadDogPhoto(
  ownerId: string,
  dogId: string,
  localUri: string,
  mimeType: string,
): Promise<string> {
  const extension = mimeType.split("/")[1] ?? "jpg";
  const path = `${ownerId}/${dogId}/${Date.now()}.${extension}`;

  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage.from("dog-photos").upload(path, arrayBuffer, {
    contentType: mimeType,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("dog-photos").getPublicUrl(path);
  return data.publicUrl;
}
