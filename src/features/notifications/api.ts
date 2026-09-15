import { supabase } from "@/lib/supabase/client";
import type { PushPlatform } from "@/lib/supabase/types";

export async function registerPushToken(
  userId: string,
  token: string,
  platform: PushPlatform,
): Promise<void> {
  const { error } = await supabase.from("push_tokens").upsert({ user_id: userId, token, platform });
  if (error) throw error;
}
