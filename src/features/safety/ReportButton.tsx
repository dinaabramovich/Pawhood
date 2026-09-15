import { useState } from "react";
import { Alert, Pressable, View } from "react-native";

import { Button, Text } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import type { ReportTargetType } from "@/lib/supabase/types";
import { colors, radii, spacing } from "@/theme/tokens";

import { createReport } from "./api";

type ReportButtonProps = {
  targetType: ReportTargetType;
  targetId: string;
};

const REASONS = ["Inappropriate content", "Fake profile", "Harassment", "Spam", "Other"];

export function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const { session } = useAuth();
  const userId = session?.user.id as string;
  const [picking, setPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleReasonPress(reason: string) {
    setSubmitting(true);
    try {
      await createReport(userId, targetType, targetId, reason);
      setPicking(false);
      Alert.alert("Report submitted", "Thanks for letting us know — we'll review this.");
    } catch (err) {
      Alert.alert("Couldn't submit report", err instanceof Error ? err.message : "Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!picking) {
    return (
      <Button
        label="Report"
        variant="ghost"
        onPress={() => setPicking(true)}
        style={{ marginTop: spacing.sm }}
      />
    );
  }

  return (
    <View style={{ marginTop: spacing.sm, width: "100%" }}>
      {REASONS.map((reason) => (
        <Pressable
          key={reason}
          onPress={() => handleReasonPress(reason)}
          disabled={submitting}
          style={{
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radii.md,
            marginBottom: spacing.sm,
          }}
        >
          <Text variant="body">{reason}</Text>
        </Pressable>
      ))}
      <Button
        label="Cancel"
        variant="ghost"
        onPress={() => setPicking(false)}
        disabled={submitting}
      />
    </View>
  );
}
