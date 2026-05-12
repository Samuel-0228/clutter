import Ionicons from "@expo/vector-icons/Ionicons";
import { ReactNode } from "react";
import { Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";

export function SettingsRow({
  icon,
  title,
  description,
  rightNode,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  rightNode?: ReactNode;
}) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surface,
        }}
      >
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "700" }}>{title}</Text>
        <Text style={{ color: theme.colors.mutedText, lineHeight: 20 }}>{description}</Text>
      </View>
      {rightNode}
    </View>
  );
}
