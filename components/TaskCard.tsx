import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useAppTheme } from "@/context/ThemeContext";
import { Task } from "@/types/task";
import { formatTaskDate, isTaskOverdue } from "@/utils/date";

import { TaskBadge } from "./TaskBadge";

export function TaskCard({
  task,
  onToggle,
  onDelete,
  onDrag,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onDrag: () => void;
}) {
  const { theme } = useAppTheme();
  const overdue = isTaskOverdue(task.dueDate, task.completed);

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Swipeable
        overshootRight={false}
        renderRightActions={() => (
          <Pressable
            onPress={onDelete}
            style={{
              width: 92,
              marginTop: 10,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.colors.dangerSoft,
            }}
          >
            <Ionicons name="trash" size={24} color={theme.colors.danger} />
          </Pressable>
        )}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/tasks/[id]",
              params: { id: task.id },
            })
          }
          style={{
            marginTop: 10,
            backgroundColor: theme.colors.card,
            borderRadius: 24,
            padding: 18,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
            <Pressable
              onPress={onToggle}
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: task.completed ? theme.colors.success : theme.colors.surface,
                marginTop: 2,
              }}
            >
              <Ionicons
                name={task.completed ? "checkmark" : "ellipse-outline"}
                size={18}
                color={task.completed ? "#08111f" : theme.colors.mutedText}
              />
            </Pressable>

            <View style={{ flex: 1, gap: 10 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 17,
                  fontWeight: "700",
                  textDecorationLine: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.65 : 1,
                }}
              >
                {task.title}
              </Text>
              {task.notes ? (
                <Text
                  numberOfLines={2}
                  style={{ color: theme.colors.mutedText, lineHeight: 22 }}
                >
                  {task.notes}
                </Text>
              ) : null}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                <TaskBadge label={task.category} tone="primary" />
                <TaskBadge
                  label={task.priority}
                  tone={task.priority === "high" ? "warning" : "neutral"}
                />
                <TaskBadge
                  label={formatTaskDate(task.dueDate)}
                  tone={overdue ? "warning" : task.completed ? "success" : "neutral"}
                />
              </View>
            </View>

            <Pressable onLongPress={onDrag} hitSlop={12} style={{ paddingTop: 4 }}>
              <Ionicons name="reorder-three-outline" size={22} color={theme.colors.mutedText} />
            </Pressable>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}
