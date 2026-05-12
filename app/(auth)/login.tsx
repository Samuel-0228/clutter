import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AuthForm } from "@/components/AuthForm";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";

export default function LoginScreen() {
  const { signIn, signInDemo, authLoading } = useAuth();
  const { theme } = useAppTheme();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: { email: string; password: string }) {
    setError(null);
    const result = await signIn(values.email, values.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.replace("/(tabs)");
  }

  async function handleDemoLogin() {
    setError(null);
    await signInDemo();
    router.replace("/(tabs)");
  }

  return (
    <Screen scrollable padded>
      <View style={{ gap: 14, marginBottom: 28 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.card,
          }}
        >
          <Ionicons name="sparkles" size={30} color={theme.colors.primary} />
        </View>
        <Text style={{ color: theme.colors.text, fontSize: 34, fontWeight: "800" }}>
          Welcome back
        </Text>
        <Text style={{ color: theme.colors.mutedText, fontSize: 16, lineHeight: 26 }}>
          Sign in to manage tasks, sync across devices, and keep your workflow moving.
        </Text>
      </View>

      <AuthForm
        submitLabel="Log In"
        loading={authLoading}
        error={error}
        onSubmit={handleSubmit}
      />

      <Pressable
        onPress={handleDemoLogin}
        style={{
          marginTop: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 18,
          paddingVertical: 16,
          alignItems: "center",
          backgroundColor: theme.colors.card,
        }}
      >
        <Text style={{ color: theme.colors.text, fontWeight: "700", fontSize: 15 }}>
          Continue in Demo Mode
        </Text>
      </Pressable>

      <Link href="/(auth)/signup" asChild>
        <Pressable style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: theme.colors.mutedText, fontSize: 15 }}>
            No account yet?{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>Create one</Text>
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
