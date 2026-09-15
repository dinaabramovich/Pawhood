import { Stack } from "expo-router";

import { ComingSoon } from "@/components/ComingSoon";

export default function SignUp() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "" }} />
      <ComingSoon title="Create your account" description="Sign-up lands in the next milestone." />
    </>
  );
}
