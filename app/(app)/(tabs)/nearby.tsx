import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { Avatar, Button, Screen, Text } from "@/components";
import { useNearbyDogs } from "@/features/nearby/useNearbyDogs";
import { colors, radii, spacing } from "@/theme/tokens";

export default function Nearby() {
  const { data: dogs, isLoading, error, refetch, isRefetching } = useNearbyDogs();

  return (
    <Screen edges={["top", "bottom"]}>
      <Text variant="title" style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
        Nearby dogs
      </Text>

      {error ? (
        <View style={{ paddingVertical: spacing.xl }}>
          <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.lg }}>
            {error instanceof Error ? error.message : "Couldn't load nearby dogs."}
          </Text>
          <Button label="Try again" variant="secondary" onPress={() => refetch()} />
        </View>
      ) : isLoading ? (
        <View style={{ flex: 1 }} />
      ) : dogs && dogs.length > 0 ? (
        <FlatList
          data={dogs}
          keyExtractor={(item) => item.dog_id}
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({ pathname: "/(app)/dog/[id]", params: { id: item.dog_id } })
              }
              style={styles.row}
            >
              <Avatar uri={item.dog_photo_url} name={item.dog_name} size={56} />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text variant="bodyStrong">{item.dog_name}</Text>
                <Text variant="caption" color="textSecondary">
                  {item.owner_display_name} · {item.distance_band}
                </Text>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <Text variant="body" color="textSecondary">
          No dogs nearby right now. Check back later, or explore the map to see dog parks.
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
