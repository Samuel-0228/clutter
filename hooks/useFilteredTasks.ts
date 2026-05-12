import { useMemo } from "react";

import { Task, TaskStatusFilter } from "@/types/task";

export function useFilteredTasks(tasks: Task[], search: string, filter: TaskStatusFilter) {
  return useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        task.notes.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "pending" && !task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [filter, search, tasks]);
}
