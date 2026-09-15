import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { Screen } from "@/components";
import { useMyDogs } from "@/features/dogs/useMyDogs";
import { useParks } from "@/features/parks/useParks";
import { useMyProfile } from "@/features/profile/useMyProfile";

const TEL_AVIV_REGION = {
  latitude: 32.0853,
  longitude: 34.7818,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

export default function MapHome() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: dogs, isLoading: dogsLoading } = useMyDogs();
  const { data: parks } = useParks();

  if (profileLoading) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  if (!profile) {
    return <Redirect href="/(app)/edit-profile" />;
  }

  if (dogsLoading) {
    return (
      <Screen>
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  if (!dogs || dogs.length === 0) {
    return <Redirect href="/(app)/create-dog" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={TEL_AVIV_REGION}
      >
        {parks?.map((park) => (
          <Marker
            key={park.id}
            coordinate={{ latitude: park.lat, longitude: park.lng }}
            title={park.name}
            description={park.address ?? undefined}
            onCalloutPress={() =>
              router.push({ pathname: "/(app)/park/[id]", params: { id: park.id } })
            }
          />
        ))}
      </MapView>
    </View>
  );
}
