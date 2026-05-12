import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";
import { TaskStatusFilter } from "@/types/task";

const filters: TaskStatusFilter[] = ["all", "pending", "completed"];

export function FilterTabs({
  value,
  onChange,
}: {
  value: TaskStatusFilter;
  onChange: (filter: TaskStatusFilter) => void;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", gap: 10, marginTop: 16, marginBottom: 20 }}>
      {filters.map((filter) => {
        const active = filter === value;

        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 16,
              backgroundColor: active ? theme.colors.primary : theme.colors.card,
              borderWidth: 1,
              borderColor: active ? theme.colors.primary : theme.colors.border,
            }}
          >
            <Text
              style={{
                color: active ? "#08111f" : theme.colors.text,
                fontWeight: "700",
                textTransform: "capitalize",
              }}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
