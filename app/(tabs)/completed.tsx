import { useMemo, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { Screen } from "@/components/Screen";
import { SearchBar } from "@/components/SearchBar";
import { TaskList } from "@/components/TaskList";
import { useTaskManager } from "@/hooks/useTaskManager";
import { useFilteredTasks } from "@/hooks/useFilteredTasks";

export default function CompletedScreen() {
  const [search, setSearch] = useState("");
  const { completedTasks, loading, toggleTask, deleteTask, reorderTasks, refreshing, refreshTasks } =
    useTaskManager();

  const tasks = useFilteredTasks(completedTasks, search, "all");

  const subtitle = useMemo(
    () => `${completedTasks.length} completed task${completedTasks.length === 1 ? "" : "s"}`,
    [completedTasks.length],
  );

  return (
    <Screen
      title="Completed"
      subtitle={subtitle}
      padded
      scrollable={false}
      rightAccessory={<SearchBar value={search} onChangeText={setSearch} compact />}
    >
      {loading ? (
        <LoadingState label="Loading completed tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="Nothing completed yet"
          description="Tasks you finish will land here so you can celebrate progress."
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onReorder={reorderTasks}
          refreshing={refreshing}
          onRefresh={refreshTasks}
        />
      )}
    </Screen>
  );
}
