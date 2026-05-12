import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { TaskEditor } from "@/components/TaskEditor";
import { useAppTheme } from "@/context/ThemeContext";
import { useTaskManager } from "@/hooks/useTaskManager";
import { formatTaskDate } from "@/utils/date";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const { tasks, updateTask, deleteTask } = useTaskManager();
  const task = tasks.find((item) => item.id === id);

  if (!id || !task) {
    return (
      <Screen padded>
        <EmptyState title="Task not found" description="This task may have been deleted already." />
      </Screen>
    );
  }

  const selectedTask = task;

  async function handleDelete() {
    await deleteTask(selectedTask.id);
    router.back();
  }

  return (
    <Screen
      title={selectedTask.title}
      subtitle={`${selectedTask.category} | ${selectedTask.priority} priority`}
      padded
      rightAccessory={
        <Pressable onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
        </Pressable>
      }
    >
      <View
        style={{
          marginBottom: 18,
          backgroundColor: theme.colors.card,
          borderRadius: 22,
          padding: 18,
          gap: 8,
        }}
      >
        <Text style={{ color: theme.colors.text, fontWeight: "700", fontSize: 17 }}>
          Summary
        </Text>
        <Text style={{ color: theme.colors.mutedText, lineHeight: 24 }}>
          {selectedTask.notes.trim() || "No notes yet. Add more details below so future you has context."}
        </Text>
        <Text style={{ color: theme.colors.mutedText, fontSize: 13 }}>
          Due {formatTaskDate(selectedTask.dueDate)}
        </Text>
      </View>

      <TaskEditor
        initialTask={selectedTask}
        submitLabel="Save Changes"
        onSubmit={async (values) => {
          await updateTask(selectedTask.id, values);
          router.back();
        }}
      />
    </Screen>
  );
}
