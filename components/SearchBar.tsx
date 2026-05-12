import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";

export function SearchBar({
  value,
  onChangeText,
  compact = false,
}: {
  value: string;
  onChangeText: (text: string) => void;
  compact?: boolean;
}) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: theme.colors.card,
        borderRadius: 18,
        paddingHorizontal: 14,
        height: compact ? 50 : 56,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Ionicons name="search" size={18} color={theme.colors.mutedText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search tasks"
        placeholderTextColor={theme.colors.mutedText}
        style={{
          flex: 1,
          color: theme.colors.text,
        }}
      />
    </View>
  );
}
