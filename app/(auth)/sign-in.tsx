import { Link, router, Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Button, Screen, Text, TextField } from "@/components";
import { signInWithEmail } from "@/features/auth/api";
import { spacing } from "@/theme/tokens";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setSubmitError(null);
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.replace("/(app)");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: "" }} />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text variant="title" style={{ marginBottom: spacing.xxl }}>
          Welcome back
        </Text>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        {submitError ? (
          <Text variant="caption" color="danger" style={{ marginBottom: spacing.lg }}>
            {submitError}
          </Text>
        ) : null}

        <Button label="Sign in" onPress={handleSubmit} loading={loading} />

        <Link href="/(auth)/sign-up" asChild>
          <Button label="Create an account" variant="ghost" style={{ marginTop: spacing.md }} />
        </Link>
      </View>
    </Screen>
  );
}
