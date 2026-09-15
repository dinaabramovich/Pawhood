import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import { Avatar, Button, Screen, Text } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import { useDog } from "@/features/dogs/useDog";
import { useStartConversation } from "@/features/messaging/useStartConversation";
import { useProfile } from "@/features/profile/useProfile";
import { BlockButton } from "@/features/safety/BlockButton";
import { ReportButton } from "@/features/safety/ReportButton";
import { colors, radii, spacing } from "@/theme/tokens";

export default function DogProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: dog, isLoading } = useDog(id);
  const { session } = useAuth();
  const startConversation = useStartConversation();
  const { data: owner } = useProfile(dog?.owner_id);

  if (isLoading || !dog) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  const isOwner = dog.owner_id === session?.user.id;
  const badges = [dog.size, dog.gender, dog.energy_level].filter(
    (value): value is NonNullable<typeof value> => !!value,
  );

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: true, title: dog.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Avatar uri={dog.photo_urls[0] ?? null} name={dog.name} size={120} />
        <Text variant="title" style={{ marginTop: spacing.lg }}>
          {dog.name}
        </Text>
        {dog.breed ? (
          <Text variant="body" color="textSecondary">
            {dog.breed}
          </Text>
        ) : null}
        {owner ? (
          <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }}>
            Owned by {owner.display_name}
          </Text>
        ) : null}

        {badges.length > 0 ? (
          <View style={styles.badgeRow}>
            {badges.map((label) => (
              <View key={label} style={styles.badge}>
                <Text
                  variant="caption"
                  color="textSecondary"
                  style={{ textTransform: "capitalize" }}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {dog.bio ? (
          <Text variant="body" style={{ marginTop: spacing.lg, textAlign: "center" }}>
            {dog.bio}
          </Text>
        ) : null}

        {isOwner ? (
          <Link href={{ pathname: "/(app)/dog/[id]/edit", params: { id: dog.id } }} asChild>
            <Button label="Edit" variant="secondary" style={{ marginTop: spacing.xxl }} />
          </Link>
        ) : (
          <>
            <Button
              label="Message"
              loading={startConversation.isPending}
              style={{ marginTop: spacing.xxl }}
              onPress={() =>
                startConversation.mutate(dog.owner_id, {
                  onSuccess: (conversationId) => {
                    router.push({
                      pathname: "/(app)/conversation/[id]",
                      params: { id: conversationId },
                    });
                  },
                  onError: (err) => {
                    Alert.alert(
                      "Couldn't start conversation",
                      err instanceof Error ? err.message : "Try again.",
                    );
                  },
                })
              }
            />
            <BlockButton
              targetUserId={dog.owner_id}
              targetName={owner?.display_name ?? "this user"}
            />
            <ReportButton targetType="user" targetId={dog.owner_id} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  badgeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
  },
});
