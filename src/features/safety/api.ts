import { supabase } from "@/lib/supabase/client";
import type { ReportTargetType } from "@/lib/supabase/types";

export async function createReport(
  reporterId: string,
  targetType: ReportTargetType,
  targetId: string,
  reason: string,
): Promise<void> {
  const { error } = await supabase.from("reports").insert({
    reporter_id: reporterId,
    target_type: targetType,
    target_id: targetId,
    reason,
  });
  if (error) throw error;
}

export type BlockedUser = {
  blocked_id: string;
  display_name: string;
  avatar_url: string | null;
};

export async function listMyBlocks(blockerId: string): Promise<BlockedUser[]> {
  const { data, error } = await supabase
    .from("blocked_users")
    .select("blocked_id, users(id, display_name, avatar_url)")
    .eq("blocker_id", blockerId);
  if (error) throw error;

  return data.map((row) => {
    const user = row.users as unknown as {
      id: string;
      display_name: string;
      avatar_url: string | null;
    };
    return {
      blocked_id: row.blocked_id,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
    };
  });
}

export async function blockUser(blockerId: string, blockedId: string): Promise<void> {
  const { error } = await supabase
    .from("blocked_users")
    .insert({ blocker_id: blockerId, blocked_id: blockedId });
  if (error) throw error;
}

export async function unblockUser(blockerId: string, blockedId: string): Promise<void> {
  const { error } = await supabase
    .from("blocked_users")
    .delete()
    .eq("blocker_id", blockerId)
    .eq("blocked_id", blockedId);
  if (error) throw error;
}
