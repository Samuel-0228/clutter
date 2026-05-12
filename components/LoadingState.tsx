import { ActivityIndicator, Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";

export function LoadingState({ label }: { label: string }) {
  const { theme } = useAppTheme();

  return (
    <View style={{ paddingVertical: 48, alignItems: "center", gap: 14 }}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <Text style={{ color: theme.colors.mutedText }}>{label}</Text>
    </View>
  );
}
