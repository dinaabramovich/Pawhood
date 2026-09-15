import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";

import { Avatar, Button, Text } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import { useMyDogs } from "@/features/dogs/useMyDogs";
import { colors, radii, spacing } from "@/theme/tokens";

import { cancelVisit, createVisit } from "./api";
import { useParkVisits, visitsQueryKey } from "./useParkVisits";

type TimeOption = { label: string; getTime: () => Date };

function atTime(hour: number, minute: number, addDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + addDays);
  date.setHours(hour, minute, 0, 0);
  return date;
}

const TIME_OPTIONS: TimeOption[] = [
  { label: "Now", getTime: () => new Date() },
  { label: "In 1 hour", getTime: () => new Date(Date.now() + 60 * 60 * 1000) },
  { label: "This evening", getTime: () => atTime(18, 0) },
  { label: "Tomorrow morning", getTime: () => atTime(9, 0, 1) },
];

function formatVisitTime(iso: string) {
  const date = new Date(iso);
  const isToday = date.toDateString() === new Date().toDateString();
  const timeLabel = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return isToday
    ? `Today at ${timeLabel}`
    : `${date.toLocaleDateString([], { weekday: "short" })} at ${timeLabel}`;
}

export function GoingSection({ parkId }: { parkId: string }) {
  const { session } = useAuth();
  const userId = session?.user.id as string;
  const { data: visits, error: visitsError, refetch: refetchVisits } = useParkVisits(parkId);
  const { data: dogs } = useMyDogs();
  const queryClient = useQueryClient();
  const [pickingTime, setPickingTime] = useState(false);

  const myVisit = visits?.find((visit) => visit.user_id === userId);

  const goMutation = useMutation({
    mutationFn: (visitTime: Date) =>
      createVisit(
        userId,
        parkId,
        visitTime.toISOString(),
        (dogs ?? []).map((dog) => dog.id),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitsQueryKey(parkId) });
      setPickingTime(false);
    },
    onError: (err) => {
      Alert.alert("Couldn't mark you as going", err instanceof Error ? err.message : "Try again.");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (visitId: string) => cancelVisit(visitId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: visitsQueryKey(parkId) }),
    onError: (err) => {
      Alert.alert("Couldn't cancel", err instanceof Error ? err.message : "Try again.");
    },
  });

  return (
    <View>
      <Text variant="subtitle" style={{ marginBottom: spacing.md }}>
        Who&rsquo;s going
      </Text>

      {visitsError ? (
        <View style={{ marginBottom: spacing.lg }}>
          <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>
            {visitsError instanceof Error ? visitsError.message : "Couldn't load who's going."}
          </Text>
          <Button label="Try again" variant="secondary" onPress={() => refetchVisits()} />
        </View>
      ) : visits && visits.length > 0 ? (
        visits.map((visit) => (
          <View
            key={visit.id}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}
          >
            <Avatar
              uri={visit.users?.avatar_url ?? null}
              name={visit.users?.display_name ?? "?"}
              size={40}
            />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text variant="bodyStrong">{visit.users?.display_name ?? "Someone"}</Text>
              <Text variant="caption" color="textSecondary">
                {formatVisitTime(visit.visit_time)}
                {visit.visit_dogs.length > 0
                  ? ` · ${visit.visit_dogs
                      .map((visitDog) => visitDog.dogs?.name)
                      .filter(Boolean)
                      .join(", ")}`
                  : ""}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.lg }}>
          No one&rsquo;s marked as going yet — be the first!
        </Text>
      )}

      <View style={{ marginTop: spacing.lg }}>
        {myVisit ? (
          <>
            <Text variant="body" style={{ marginBottom: spacing.sm }}>
              You&rsquo;re going {formatVisitTime(myVisit.visit_time)}
            </Text>
            <Button
              label="Cancel"
              variant="secondary"
              loading={cancelMutation.isPending}
              onPress={() => cancelMutation.mutate(myVisit.id)}
            />
          </>
        ) : pickingTime ? (
          <View>
            {TIME_OPTIONS.map((option) => (
              <Pressable
                key={option.label}
                onPress={() => goMutation.mutate(option.getTime())}
                style={{
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radii.md,
                  marginBottom: spacing.sm,
                }}
              >
                <Text variant="body">{option.label}</Text>
              </Pressable>
            ))}
            <Button label="Never mind" variant="ghost" onPress={() => setPickingTime(false)} />
          </View>
        ) : (
          <Button
            label="I'm going"
            onPress={() => setPickingTime(true)}
            loading={goMutation.isPending}
          />
        )}
      </View>
    </View>
  );
}
