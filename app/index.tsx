import { Redirect } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useOnboarding } from "@/hooks/useOnboarding";

import { FullScreenLoader } from "@/components/FullScreenLoader";

export default function IndexScreen() {
  const { initialized, session } = useAuth();
  const { theme } = useAppTheme();
  const { isLoading, completed } = useOnboarding();

  if (!initialized || isLoading) {
    return <FullScreenLoader label="Preparing your workspace..." theme={theme} />;
  }

  if (!completed) {
    return <Redirect href="/onboarding" />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
