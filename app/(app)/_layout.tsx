import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/features/auth/AuthProvider";

export default function AppLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
