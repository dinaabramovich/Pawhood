import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/features/auth/AuthProvider";
import { usePushRegistration } from "@/features/notifications/usePushRegistration";

export default function AppLayout() {
  const { session } = useAuth();
  usePushRegistration();

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
