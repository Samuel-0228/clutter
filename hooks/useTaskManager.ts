import { useMemo } from "react";

import { useTasks } from "@/context/TaskContext";
import { isTaskOverdue } from "@/utils/date";

export function useTaskManager() {
  const context = useTasks();

  const stats = useMemo(() => {
    const completed = context.tasks.filter((task) => task.completed).length;
    const overdue = context.tasks.filter((task) => isTaskOverdue(task.dueDate, task.completed)).length;

    return {
      total: context.tasks.length,
      completed,
      pending: context.tasks.length - completed,
      overdue,
    };
  }, [context.tasks]);

  const completedTasks = useMemo(
    () => context.tasks.filter((task) => task.completed),
    [context.tasks],
  );

  return {
    ...context,
    stats,
    completedTasks,
  };
}
