import { TASK_CATEGORIES, TASK_PRIORITIES, Task, TaskInput } from "@/types/task";

export function createEmptyTaskInput(): TaskInput {
  return {
    title: "",
    notes: "",
    category: TASK_CATEGORIES[0],
    dueDate: null,
    priority: TASK_PRIORITIES[1],
    completed: false,
  };
}

export function toTaskInput(task: Task): TaskInput {
  return {
    title: task.title,
    notes: task.notes,
    category: task.category,
    dueDate: task.dueDate,
    priority: task.priority,
    completed: task.completed,
  };
}
