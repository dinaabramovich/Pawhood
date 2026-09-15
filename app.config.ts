import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Pawhood",
  slug: "pawhood",
  scheme: "pawhood",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.pawhood.app",
  },
  android: {
    package: "com.pawhood.app",
    adaptiveIcon: {
      backgroundColor: "#D97757",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#FBF9F6",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "Pawhood uses your photos to set your profile and dog pictures.",
      },
    ],
    [
      "react-native-maps",
      {
        iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
        androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
      },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "Pawhood uses your location to show nearby dog parks and dogs. Your exact location is never shown to other users.",
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/android-icon-foreground.png",
        color: "#D97757",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      // Set after running `eas init`.
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
};

export default config;
