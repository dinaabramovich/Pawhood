import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { Screen, Text } from "@/components";
import { usePark } from "@/features/parks/usePark";
import { spacing } from "@/theme/tokens";

export default function ParkDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: park, isLoading } = usePark(id);

  if (isLoading || !park) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: true, title: park.name }} />
      <ScrollView contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxl }}>
        <Text variant="title">{park.name}</Text>
        {park.address ? (
          <Text variant="body" color="textSecondary" style={{ marginTop: spacing.xs }}>
            {park.address}
          </Text>
        ) : null}
        {park.description ? (
          <Text variant="body" style={{ marginTop: spacing.lg }}>
            {park.description}
          </Text>
        ) : null}

        <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xxl }}>
          Seeing who&rsquo;s headed here, and marking &ldquo;I&rsquo;m going,&rdquo; lands in the
          next milestone.
        </Text>
      </ScrollView>
    </Screen>
  );
}
