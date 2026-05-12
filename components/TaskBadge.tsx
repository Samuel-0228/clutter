import { Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";

export function TaskBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "primary" | "success" | "warning";
}) {
  const { theme } = useAppTheme();

  const backgroundColor =
    tone === "primary"
      ? theme.colors.primarySoft
      : tone === "success"
        ? `${theme.colors.success}22`
        : tone === "warning"
          ? `${theme.colors.warning}22`
          : theme.colors.surface;

  const textColor =
    tone === "primary"
      ? theme.colors.primary
      : tone === "success"
        ? theme.colors.success
        : tone === "warning"
          ? theme.colors.warning
          : theme.colors.mutedText;

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor,
      }}
    >
      <Text style={{ color: textColor, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}
