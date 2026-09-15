import { Stack } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import { Avatar, Button, Screen, Text } from "@/components";
import { useBlockedUsers } from "@/features/safety/useBlockedUsers";
import { useUnblockUser } from "@/features/safety/useUnblockUser";
import { spacing } from "@/theme/tokens";

export default function BlockedUsers() {
  const { data: blocked, isLoading, error, refetch } = useBlockedUsers();
  const unblock = useUnblockUser();

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: true, title: "Blocked users" }} />
      {error ? (
        <View style={{ marginTop: spacing.lg }}>
          <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.lg }}>
            {error instanceof Error ? error.message : "Couldn't load blocked users."}
          </Text>
          <Button label="Try again" variant="secondary" onPress={() => refetch()} />
        </View>
      ) : isLoading ? (
        <View style={{ flex: 1 }} />
      ) : blocked && blocked.length > 0 ? (
        <FlatList
          data={blocked}
          keyExtractor={(item) => item.blocked_id}
          contentContainerStyle={{ paddingTop: spacing.lg }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Avatar uri={item.avatar_url} name={item.display_name} size={40} />
              <Text variant="body" style={{ marginLeft: spacing.md, flex: 1 }}>
                {item.display_name}
              </Text>
              <Button
                label="Unblock"
                variant="secondary"
                loading={unblock.isPending}
                onPress={() => unblock.mutate(item.blocked_id)}
              />
            </View>
          )}
        />
      ) : (
        <Text variant="body" color="textSecondary" style={{ marginTop: spacing.lg }}>
          You haven&rsquo;t blocked anyone.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
});
