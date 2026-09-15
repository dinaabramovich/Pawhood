import { supabase } from "@/lib/supabase/client";
import type { UsersInsert, UsersRow, UsersUpdate } from "@/lib/supabase/types";

export async function getMyProfile(userId: string): Promise<UsersRow | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProfile(input: UsersInsert): Promise<UsersRow> {
  const { data, error } = await supabase.from("users").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, input: UsersUpdate): Promise<UsersRow> {
  const { data, error } = await supabase
    .from("users")
    .update(input)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadAvatar(
  userId: string,
  localUri: string,
  mimeType: string,
): Promise<string> {
  const extension = mimeType.split("/")[1] ?? "jpg";
  const path = `${userId}/avatar.${extension}`;

  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage.from("avatars").upload(path, arrayBuffer, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  // Cache-bust: the path is stable across re-uploads, so clients would
  // otherwise keep showing a stale cached image after a new upload.
  return `${data.publicUrl}?t=${Date.now()}`;
}
