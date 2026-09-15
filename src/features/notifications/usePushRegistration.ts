import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

import { useAuth } from "@/features/auth/AuthProvider";

import { registerPushToken } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Registers this device for push notifications once the user is signed in.
// Requires a deployed EAS project (for the push token) and, for delivery,
// the notify-new-message Edge Function + a database webhook wired up
// server-side — see supabase/functions/notify-new-message/index.ts.
export function usePushRegistration() {
  const { session } = useAuth();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId || !Device.isDevice) return;

    let cancelled = false;

    async function register() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) return;

      try {
        const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
        if (!cancelled && userId) {
          await registerPushToken(
            userId,
            pushToken.data,
            Platform.OS === "ios" ? "ios" : "android",
          );
        }
      } catch {
        // Offline, or Expo's push service unreachable — safe to skip; this
        // will just retry the next time the app opens.
      }
    }

    register();

    return () => {
      cancelled = true;
    };
  }, [userId]);
}
