import { View } from "react-native";

import { Button, Screen, Text } from "@/components";
import { signOut } from "@/features/auth/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { spacing } from "@/theme/tokens";

export default function AppHome() {
  const { session } = useAuth();

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", gap: spacing.sm }}>
        <Text variant="title">You&rsquo;re in</Text>
        <Text variant="body" color="textSecondary">
          Signed in as {session?.user.email}. Profile and dog setup land in the next milestones.
        </Text>
        <Button
          label="Sign out"
          variant="secondary"
          onPress={() => signOut()}
          style={{ marginTop: spacing.xl }}
        />
      </View>
    </Screen>
  );
}
