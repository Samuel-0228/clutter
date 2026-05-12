export function formatTaskDate(date: string | null) {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isTaskOverdue(date: string | null, completed: boolean) {
  if (!date || completed) return false;

  const dueDate = new Date(date);
  const today = new Date();

  dueDate.setHours(23, 59, 59, 999);
  return dueDate.getTime() < today.getTime();
}

export function toDateInputValue(date: string | null) {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}
