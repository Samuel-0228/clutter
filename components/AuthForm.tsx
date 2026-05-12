import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";

type AuthFormProps = {
  submitLabel: string;
  loading: boolean;
  error: string | null;
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
};

export function AuthForm({ submitLabel, loading, error, onSubmit }: AuthFormProps) {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ gap: 16 }}>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={theme.colors.mutedText}
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: theme.colors.card,
          color: theme.colors.text,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={theme.colors.mutedText}
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: theme.colors.card,
          color: theme.colors.text,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      />
      {error ? (
        <Text style={{ color: theme.colors.danger, fontSize: 14, lineHeight: 22 }}>{error}</Text>
      ) : null}
      <Pressable
        onPress={() => onSubmit({ email, password })}
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 18,
          paddingVertical: 18,
          alignItems: "center",
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text style={{ color: "#08111f", fontWeight: "800", fontSize: 16 }}>
          {loading ? "Please wait..." : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}
