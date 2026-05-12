import { ActivityIndicator, Text, View } from "react-native";

import { AppTheme } from "@/utils/theme";

export function FullScreenLoader({ label, theme }: { label: string; theme: AppTheme }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ color: theme.colors.mutedText, fontSize: 15 }}>{label}</Text>
    </View>
  );
}
