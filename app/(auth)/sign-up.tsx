import { Link, router, Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Button, Screen, Text, TextField } from "@/components";
import { signUpWithEmail } from "@/features/auth/api";
import { spacing } from "@/theme/tokens";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const nextErrors: typeof fieldErrors = {};
    if (!EMAIL_REGEX.test(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setLoading(true);
    try {
      const { session } = await signUpWithEmail(email.trim(), password);
      if (!session) {
        setSubmitError("Check your email to confirm your account, then sign in.");
        return;
      }
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
          Create your account
        </Text>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password-new"
          error={fieldErrors.password}
        />

        {submitError ? (
          <Text variant="caption" color="danger" style={{ marginBottom: spacing.lg }}>
            {submitError}
          </Text>
        ) : null}

        <Button label="Create account" onPress={handleSubmit} loading={loading} />

        <Link href="/(auth)/sign-in" asChild>
          <Button
            label="I already have an account"
            variant="ghost"
            style={{ marginTop: spacing.md }}
          />
        </Link>
      </View>
    </Screen>
  );
}
