import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";

export function FloatingActionButton({ onPress }: { onPress: () => void }) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        right: 22,
        bottom: 110,
        width: 62,
        height: 62,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.fabShadow,
        shadowOpacity: 1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
      }}
    >
      <Ionicons name="add" size={30} color="#08111f" />
    </Pressable>
  );
}
