import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";

import { Avatar, Button, SegmentedControl, Text, TextField } from "@/components";
import type { DogEnergyLevel, DogGender, DogSize } from "@/lib/supabase/types";
import { spacing } from "@/theme/tokens";

export type DogFormValues = {
  name: string;
  breed: string;
  size: DogSize | null;
  gender: DogGender | null;
  energyLevel: DogEnergyLevel | null;
  bio: string;
  photoUrl: string | null;
};

type DogFormProps = {
  initialValues?: Partial<DogFormValues>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (values: DogFormValues, photoAsset: ImagePicker.ImagePickerAsset | null) => void;
};

const SIZE_OPTIONS: { label: string; value: DogSize }[] = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const GENDER_OPTIONS: { label: string; value: DogGender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const ENERGY_OPTIONS: { label: string; value: DogEnergyLevel }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export function DogForm({ initialValues, submitLabel, loading, onSubmit }: DogFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [breed, setBreed] = useState(initialValues?.breed ?? "");
  const [size, setSize] = useState<DogSize | null>(initialValues?.size ?? null);
  const [gender, setGender] = useState<DogGender | null>(initialValues?.gender ?? null);
  const [energyLevel, setEnergyLevel] = useState<DogEnergyLevel | null>(
    initialValues?.energyLevel ?? null,
  );
  const [bio, setBio] = useState(initialValues?.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialValues?.photoUrl ?? null);
  const [photoAsset, setPhotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [nameError, setNameError] = useState<string | undefined>();

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Enable photo library access to add a dog photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoAsset(result.assets[0]);
      setPhotoUrl(result.assets[0].uri);
    }
  }

  function handleSubmit() {
    if (name.trim().length < 1) {
      setNameError("Enter your dog's name.");
      return;
    }
    setNameError(undefined);
    onSubmit(
      {
        name: name.trim(),
        breed: breed.trim(),
        size,
        gender,
        energyLevel,
        bio: bio.trim(),
        photoUrl,
      },
      photoAsset,
    );
  }

  return (
    <View>
      <Pressable
        onPress={handlePickPhoto}
        style={{ alignSelf: "center", marginBottom: spacing.xxl }}
      >
        <Avatar uri={photoUrl} name={name || "?"} size={96} />
        <Text
          variant="caption"
          color="brand"
          style={{ marginTop: spacing.sm, textAlign: "center" }}
        >
          {photoUrl ? "Change photo" : "Add photo"}
        </Text>
      </Pressable>

      <TextField label="Name" value={name} onChangeText={setName} error={nameError} />
      <TextField label="Breed (optional)" value={breed} onChangeText={setBreed} />

      <Text variant="caption" color="textSecondary" style={{ marginBottom: spacing.xs }}>
        Size
      </Text>
      <SegmentedControl
        options={SIZE_OPTIONS}
        value={size}
        onChange={setSize}
        style={{ marginBottom: spacing.lg }}
      />

      <Text variant="caption" color="textSecondary" style={{ marginBottom: spacing.xs }}>
        Gender
      </Text>
      <SegmentedControl
        options={GENDER_OPTIONS}
        value={gender}
        onChange={setGender}
        style={{ marginBottom: spacing.lg }}
      />

      <Text variant="caption" color="textSecondary" style={{ marginBottom: spacing.xs }}>
        Energy level
      </Text>
      <SegmentedControl
        options={ENERGY_OPTIONS}
        value={energyLevel}
        onChange={setEnergyLevel}
        style={{ marginBottom: spacing.lg }}
      />

      <TextField
        label="About your dog (optional)"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: "top" }}
      />

      <Button label={submitLabel} onPress={handleSubmit} loading={loading} />
    </View>
  );
}
