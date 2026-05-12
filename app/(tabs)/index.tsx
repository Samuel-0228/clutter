import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { FilterTabs } from "@/components/FilterTabs";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { LoadingState } from "@/components/LoadingState";
import { Screen } from "@/components/Screen";
import { SearchBar } from "@/components/SearchBar";
import { TaskBadge } from "@/components/TaskBadge";
import { TaskComposerModal } from "@/components/TaskComposerModal";
import { TaskList } from "@/components/TaskList";
import { useAppTheme } from "@/context/ThemeContext";
import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import { useTaskManager } from "@/hooks/useTaskManager";
import { TaskStatusFilter } from "@/types/task";

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TaskStatusFilter>("all");
  const [showComposer, setShowComposer] = useState(false);
  const {
    tasks,
    loading,
    stats,
    createTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    refreshing,
    refreshTasks,
  } = useTaskManager();

  const filteredTasks = useFilteredTasks(tasks, search, filter);

  const headline = useMemo(() => {
    if (stats.pending === 0) return "Everything is under control.";
    if (stats.overdue > 0) return `${stats.overdue} task${stats.overdue === 1 ? "" : "s"} need attention.`;
    return `${stats.pending} pending task${stats.pending === 1 ? "" : "s"} ready for action.`;
  }, [stats.overdue, stats.pending]);

  return (
    <>
      <Screen
        padded
        scrollable={false}
        title="My Tasks"
        subtitle={headline}
        rightAccessory={
          <Pressable
            onPress={() => setShowComposer(true)}
            style={{
              width: 46,
              height: 46,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.colors.card,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Ionicons name="add" size={24} color={theme.colors.primary} />
          </Pressable>
        }
      >
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.card,
              borderRadius: 22,
              padding: 16,
              gap: 8,
            }}
          >
            <Text style={{ color: theme.colors.mutedText }}>Productivity</Text>
            <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "800" }}>
              {stats.completed}/{stats.total || 0}
            </Text>
            <TaskBadge label="Tasks closed" tone="success" />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.primarySoft,
              borderRadius: 22,
              padding: 16,
              gap: 8,
            }}
          >
            <Text style={{ color: theme.colors.mutedText }}>Urgent</Text>
            <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "800" }}>
              {stats.overdue}
            </Text>
            <TaskBadge label="Overdue items" tone="warning" />
          </View>
        </View>

        <SearchBar value={search} onChangeText={setSearch} />
        <FilterTabs value={filter} onChange={setFilter} />

        {loading ? (
          <LoadingState label="Loading your tasks..." />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="Your workspace is clear"
            description="Create your first task, add due dates and priorities, then drag items around as your day changes."
          />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onReorder={reorderTasks}
            refreshing={refreshing}
            onRefresh={refreshTasks}
          />
        )}
      </Screen>

      <FloatingActionButton onPress={() => setShowComposer(true)} />
      <TaskComposerModal
        visible={showComposer}
        onClose={() => setShowComposer(false)}
        onSubmit={createTask}
      />
    </>
  );
}
