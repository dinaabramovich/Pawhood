import { Link, Redirect } from "expo-router";
import { View } from "react-native";

import { Avatar, Button, Screen, Text } from "@/components";
import { signOut } from "@/features/auth/api";
import { useMyProfile } from "@/features/profile/useMyProfile";
import { spacing } from "@/theme/tokens";

export default function AppHome() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  if (!profile) {
    return <Redirect href="/(app)/edit-profile" />;
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", gap: spacing.sm }}>
        <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
          <Avatar uri={profile.avatar_url} name={profile.display_name} size={80} />
        </View>
        <Text variant="title" style={{ textAlign: "center" }}>
          {profile.display_name}
        </Text>
        <Text variant="body" color="textSecondary" style={{ textAlign: "center" }}>
          {profile.city}
        </Text>
        <Text variant="caption" color="textSecondary" style={{ textAlign: "center" }}>
          Dog profiles and the park map land in the next milestones.
        </Text>

        <Link href="/(app)/edit-profile" asChild>
          <Button label="Edit profile" variant="secondary" style={{ marginTop: spacing.xl }} />
        </Link>
        <Button
          label="Sign out"
          variant="ghost"
          onPress={() => signOut()}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </Screen>
  );
}
