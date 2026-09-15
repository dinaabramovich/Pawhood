import { Link, Redirect } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Avatar, Button, Screen, Text } from "@/components";
import { signOut } from "@/features/auth/api";
import { useMyDogs } from "@/features/dogs/useMyDogs";
import { useMyProfile } from "@/features/profile/useMyProfile";
import { colors, radii, spacing } from "@/theme/tokens";

export default function AppHome() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: dogs, isLoading: dogsLoading } = useMyDogs();

  if (profileLoading) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  if (!profile) {
    return <Redirect href="/(app)/edit-profile" />;
  }

  if (dogsLoading) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  if (!dogs || dogs.length === 0) {
    return <Redirect href="/(app)/create-dog" />;
  }

  return (
    <Screen>
      <View style={{ flex: 1, paddingTop: spacing.xxl }}>
        <View style={{ alignItems: "center", marginBottom: spacing.xxl }}>
          <Avatar uri={profile.avatar_url} name={profile.display_name} size={72} />
          <Text variant="title" style={{ marginTop: spacing.md }}>
            {profile.display_name}
          </Text>
          <Text variant="body" color="textSecondary">
            {profile.city}
          </Text>
        </View>

        <Text variant="subtitle" style={{ marginBottom: spacing.md }}>
          Your dogs
        </Text>
        {dogs.map((dog) => (
          <Link
            key={dog.id}
            href={{ pathname: "/(app)/dog/[id]/edit", params: { id: dog.id } }}
            asChild
          >
            <Pressable style={styles.dogRow}>
              <Avatar uri={dog.photo_urls[0] ?? null} name={dog.name} size={48} />
              <View style={{ marginLeft: spacing.md }}>
                <Text variant="bodyStrong">{dog.name}</Text>
                {dog.breed ? (
                  <Text variant="caption" color="textSecondary">
                    {dog.breed}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          </Link>
        ))}

        <Link href="/(app)/create-dog" asChild>
          <Button label="Add another dog" variant="secondary" style={{ marginTop: spacing.sm }} />
        </Link>

        <Text
          variant="caption"
          color="textSecondary"
          style={{ marginTop: spacing.xxl, textAlign: "center" }}
        >
          The park map lands in the next milestone.
        </Text>

        <Link href="/(app)/edit-profile" asChild>
          <Button label="Edit profile" variant="ghost" style={{ marginTop: spacing.xl }} />
        </Link>
        <Button label="Sign out" variant="ghost" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dogRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
});
