import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { Alert, View } from "react-native";

import { Screen, Text } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import { createDog, updateDog, uploadDogPhoto } from "@/features/dogs/api";
import { DogForm, type DogFormValues } from "@/features/dogs/DogForm";
import { dogsQueryKey } from "@/features/dogs/useMyDogs";
import { spacing } from "@/theme/tokens";

type SubmitArgs = {
  values: DogFormValues;
  photoAsset: ImagePicker.ImagePickerAsset | null;
};

export default function CreateDog() {
  const { session } = useAuth();
  const ownerId = session?.user.id as string;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ values, photoAsset }: SubmitArgs) => {
      const dog = await createDog({
        owner_id: ownerId,
        name: values.name,
        breed: values.breed || null,
        size: values.size,
        gender: values.gender,
        energy_level: values.energyLevel,
        bio: values.bio || null,
      });

      if (photoAsset) {
        const url = await uploadDogPhoto(
          ownerId,
          dog.id,
          photoAsset.uri,
          photoAsset.mimeType ?? "image/jpeg",
        );
        await updateDog(dog.id, { photo_urls: [url] });
      }

      return dog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dogsQueryKey(ownerId) });
      router.replace("/(app)");
    },
    onError: (err) => {
      Alert.alert("Couldn't save dog", err instanceof Error ? err.message : "Try again.");
    },
  });

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: "" }} />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text variant="title" style={{ marginBottom: spacing.xxl }}>
          Add your dog
        </Text>
        <DogForm
          submitLabel="Continue"
          loading={mutation.isPending}
          onSubmit={(values, photoAsset) => mutation.mutate({ values, photoAsset })}
        />
      </View>
    </Screen>
  );
}
