import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { colors, radii } from "@/theme/tokens";

import { Text } from "./Text";

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 48 }: AvatarProps) {
  const initials = getInitials(name);
  const dimensions = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dimensions]} contentFit="cover" />;
  }

  return (
    <View style={[styles.fallback, dimensions]}>
      <Text variant="bodyStrong" color="brand" style={{ fontSize: size * 0.4 }}>
        {initials}
      </Text>
    </View>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceMuted,
  },
  fallback: {
    backgroundColor: colors.brandMuted,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
  },
});
