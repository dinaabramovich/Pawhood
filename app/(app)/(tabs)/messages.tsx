import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { Avatar, Screen, Text } from "@/components";
import { useConversations } from "@/features/messaging/useConversations";
import { colors, radii, spacing } from "@/theme/tokens";

export default function Messages() {
  const { data: conversations, isLoading } = useConversations();

  return (
    <Screen edges={["top", "bottom"]}>
      <Text variant="title" style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
        Messages
      </Text>

      {isLoading ? (
        <View style={{ flex: 1 }} />
      ) : conversations && conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({ pathname: "/(app)/conversation/[id]", params: { id: item.id } })
              }
              style={styles.row}
            >
              <Avatar
                uri={item.other_user.avatar_url}
                name={item.other_user.display_name}
                size={48}
              />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text variant="bodyStrong">{item.other_user.display_name}</Text>
                <Text variant="caption" color="textSecondary" numberOfLines={1}>
                  {item.last_message_preview ?? "Say hi"}
                </Text>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <Text variant="body" color="textSecondary">
          No conversations yet. Message someone from their dog&rsquo;s profile to get started.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
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
