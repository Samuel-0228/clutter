export const TASK_CATEGORIES = ["Work", "Personal", "Health", "Study", "Errands"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatusFilter = "all" | "pending" | "completed";

export type Task = {
  id: string;
  userId: string;
  title: string;
  notes: string;
  completed: boolean;
  category: TaskCategory;
  dueDate: string | null;
  priority: TaskPriority;
  position: number;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
};

export type TaskInput = {
  title: string;
  notes: string;
  category: TaskCategory;
  dueDate: string | null;
  priority: TaskPriority;
  completed?: boolean;
};

export type TaskStats = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
};
