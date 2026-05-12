import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AuthForm } from "@/components/AuthForm";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";

export default function SignupScreen() {
  const { signUp, authLoading } = useAuth();
  const { theme } = useAppTheme();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: { email: string; password: string }) {
    setError(null);
    const result = await signUp(values.email, values.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

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
          <Ionicons name="planet" size={30} color={theme.colors.primary} />
        </View>
        <Text style={{ color: theme.colors.text, fontSize: 34, fontWeight: "800" }}>
          Create your account
        </Text>
        <Text style={{ color: theme.colors.mutedText, fontSize: 16, lineHeight: 26 }}>
          Start with a clean workspace today and keep every task secure to your account.
        </Text>
      </View>

      <AuthForm
        submitLabel="Sign Up"
        loading={authLoading}
        error={error}
        onSubmit={handleSubmit}
      />

      <Link href="/(auth)/login" asChild>
        <Pressable style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: theme.colors.mutedText, fontSize: 15 }}>
            Already have an account?{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>Log in</Text>
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
