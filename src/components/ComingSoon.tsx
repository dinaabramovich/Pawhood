import { View } from "react-native";

import { spacing } from "@/theme/tokens";

import { Screen } from "./Screen";
import { Text } from "./Text";

type ComingSoonProps = {
  title: string;
  description: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", gap: spacing.sm }}>
        <Text variant="title">{title}</Text>
        <Text variant="body" color="textSecondary">
          {description}
        </Text>
      </View>
    </Screen>
  );
}
