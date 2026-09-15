import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, View } from "react-native";

import { Screen, Text } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import { updateDog, uploadDogPhoto } from "@/features/dogs/api";
import { DogForm, type DogFormValues } from "@/features/dogs/DogForm";
import { dogQueryKey, useDog } from "@/features/dogs/useDog";
import { dogsQueryKey } from "@/features/dogs/useMyDogs";
import { spacing } from "@/theme/tokens";

type SubmitArgs = {
  values: DogFormValues;
  photoAsset: ImagePicker.ImagePickerAsset | null;
};

export default function EditDog() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const ownerId = session?.user.id as string;
  const { data: dog, isLoading } = useDog(id);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ values, photoAsset }: SubmitArgs) => {
      let photoUrls = dog?.photo_urls ?? [];
      if (photoAsset) {
        const url = await uploadDogPhoto(
          ownerId,
          id,
          photoAsset.uri,
          photoAsset.mimeType ?? "image/jpeg",
        );
        photoUrls = [url];
      }

      return updateDog(id, {
        name: values.name,
        breed: values.breed || null,
        size: values.size,
        gender: values.gender,
        energy_level: values.energyLevel,
        bio: values.bio || null,
        photo_urls: photoUrls,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dogsQueryKey(ownerId) });
      queryClient.invalidateQueries({ queryKey: dogQueryKey(id) });
      router.replace("/(app)");
    },
    onError: (err) => {
      Alert.alert("Couldn't save dog", err instanceof Error ? err.message : "Try again.");
    },
  });

  if (isLoading || !dog) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: "" }} />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text variant="title" style={{ marginBottom: spacing.xxl }}>
          Edit {dog.name}
        </Text>
        <DogForm
          submitLabel="Save changes"
          loading={mutation.isPending}
          initialValues={{
            name: dog.name,
            breed: dog.breed ?? "",
            size: dog.size,
            gender: dog.gender,
            energyLevel: dog.energy_level,
            bio: dog.bio ?? "",
            photoUrl: dog.photo_urls[0] ?? null,
          }}
          onSubmit={(values, photoAsset) => mutation.mutate({ values, photoAsset })}
        />
      </View>
    </Screen>
  );
}
