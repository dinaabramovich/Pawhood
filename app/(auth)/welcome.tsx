import { Link } from "expo-router";
import { View } from "react-native";

import { Button, Screen, Text } from "@/components";
import { spacing } from "@/theme/tokens";

export default function Welcome() {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "space-between", paddingVertical: spacing.xxxl }}>
        <View style={{ marginTop: spacing.huge }}>
          <Text variant="display">Pawhood</Text>
          <Text variant="subtitle" color="textSecondary" style={{ marginTop: spacing.sm }}>
            Find your dog&rsquo;s people.
          </Text>
        </View>

        <View>
          <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.xxl }}>
            Discover dog parks nearby, see who&rsquo;s headed there, and meet dogs in your
            neighborhood — starting in Tel Aviv.
          </Text>

          <Link href="/(auth)/sign-up" asChild>
            <Button label="Get started" />
          </Link>
          <Link href="/(auth)/sign-in" asChild>
            <Button
              label="I already have an account"
              variant="ghost"
              style={{ marginTop: spacing.md }}
            />
          </Link>
        </View>
      </View>
    </Screen>
  );
}
