import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";

export function EmptyState({ title, description }: { title: string; description: string }) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        marginTop: 32,
        borderRadius: 28,
        padding: 28,
        alignItems: "center",
        backgroundColor: theme.colors.card,
        gap: 12,
      }}
    >
      <Ionicons name="file-tray-outline" size={32} color={theme.colors.primary} />
      <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: "800" }}>{title}</Text>
      <Text style={{ color: theme.colors.mutedText, textAlign: "center", lineHeight: 24 }}>
        {description}
      </Text>
    </View>
  );
}
