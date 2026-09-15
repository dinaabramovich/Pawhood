import { Stack } from "expo-router";

import { ComingSoon } from "@/components/ComingSoon";

export default function SignIn() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "" }} />
      <ComingSoon
        title="Sign in"
        description="Email and password sign-in lands in the next milestone."
      />
    </>
  );
}
