import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";

import { Avatar, Button, Screen, Text, TextField } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import { createProfile, updateProfile, uploadAvatar } from "@/features/profile/api";
import { profileQueryKey, useMyProfile } from "@/features/profile/useMyProfile";
import { spacing } from "@/theme/tokens";

export default function EditProfile() {
  const { session } = useAuth();
  const userId = session?.user.id as string;
  const { data: profile } = useMyProfile();
  const queryClient = useQueryClient();
  const isNewProfile = !profile;

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "Tel Aviv");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);
  const [pickedAsset, setPickedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | undefined>();

  const mutation = useMutation({
    mutationFn: async () => {
      let nextAvatarUrl = avatarUrl;
      if (pickedAsset) {
        nextAvatarUrl = await uploadAvatar(
          userId,
          pickedAsset.uri,
          pickedAsset.mimeType ?? "image/jpeg",
        );
      }

      const payload = {
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        city: city.trim() || "Tel Aviv",
        avatar_url: nextAvatarUrl,
      };

      if (isNewProfile) {
        return createProfile({ id: userId, ...payload });
      }
      return updateProfile(userId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
      router.replace("/(app)");
    },
    onError: (err) => {
      Alert.alert("Couldn't save profile", err instanceof Error ? err.message : "Try again.");
    },
  });

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Enable photo library access to set a profile photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPickedAsset(result.assets[0]);
      setAvatarUrl(result.assets[0].uri);
    }
  }

  function handleSubmit() {
    if (displayName.trim().length < 2) {
      setDisplayNameError("Enter at least 2 characters.");
      return;
    }
    setDisplayNameError(undefined);
    mutation.mutate();
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: !isNewProfile, title: "" }} />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text variant="title" style={{ marginBottom: spacing.xxl }}>
          {isNewProfile ? "Set up your profile" : "Edit profile"}
        </Text>

        <Pressable
          onPress={handlePickImage}
          style={{ alignSelf: "center", marginBottom: spacing.xxl }}
        >
          <Avatar uri={avatarUrl} name={displayName || "?"} size={96} />
          <Text
            variant="caption"
            color="brand"
            style={{ marginTop: spacing.sm, textAlign: "center" }}
          >
            {avatarUrl ? "Change photo" : "Add photo"}
          </Text>
        </Pressable>

        <TextField
          label="Your name"
          value={displayName}
          onChangeText={setDisplayName}
          error={displayNameError}
        />
        <TextField label="City" value={city} onChangeText={setCity} />
        <TextField
          label="About you (optional)"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />

        <Button
          label={isNewProfile ? "Continue" : "Save changes"}
          onPress={handleSubmit}
          loading={mutation.isPending}
        />
      </View>
    </Screen>
  );
}
