import { Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Screen, Text } from "@/components";
import { useAuth } from "@/features/auth/AuthProvider";
import { useMessages } from "@/features/messaging/useMessages";
import { useSendMessage } from "@/features/messaging/useSendMessage";
import type { MessagesRow } from "@/lib/supabase/types";
import { colors, radii, spacing } from "@/theme/tokens";

export default function Conversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const myId = session?.user.id;
  const { data: messages } = useMessages(id);
  const sendMessage = useSendMessage(id);
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList<MessagesRow>>(null);

  function handleSend() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    sendMessage.mutate(body);
  }

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: true, title: "" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: spacing.lg }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMine = item.sender_id === myId;
            return (
              <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text variant="body" color={isMine ? "textInverse" : "textPrimary"}>
                  {item.body}
                </Text>
              </View>
            );
          }}
        />

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            onSubmitEditing={handleSend}
            multiline
          />
          <Pressable
            onPress={handleSend}
            disabled={sendMessage.isPending}
            style={[styles.sendButton, sendMessage.isPending && { opacity: 0.5 }]}
          >
            <Text variant="bodyStrong" color="textInverse">
              Send
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "78%",
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  bubbleMine: {
    backgroundColor: colors.brand,
    alignSelf: "flex-end",
  },
  bubbleTheirs: {
    backgroundColor: colors.surfaceMuted,
    alignSelf: "flex-start",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  sendButton: {
    backgroundColor: colors.brand,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: "center",
  },
});
