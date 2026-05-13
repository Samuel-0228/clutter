import * as Haptics from "expo-haptics";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { readItem, saveItem } from "@/services/storage";
import {
    createRemoteTask,
    deleteRemoteTask,
    fetchRemoteTasks,
    subscribeToTaskChanges,
    unsubscribeFromTaskChanges,
    updateRemoteTask,
} from "@/services/taskService";
import { Task, TaskInput } from "@/types/task";

const TASK_CACHE_KEY = "taskapp:tasks-cache";

type TaskContextValue = {
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  createTask: (input: TaskInput) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskInput>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextValue | null>(null);

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => a.position - b.position);
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const { session, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = user?.id ?? "anonymous";
  const realtimeCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      setLoading(true);

      const cachedTasks = await readItem<Task[]>(
        `${TASK_CACHE_KEY}:${userId}`,
        [],
      );
      if (active) {
        setTasks(sortTasks(cachedTasks));
      }

      if (session) {
        await syncTasks();
      } else if (active) {
        setLoading(false);
      }
    }

    bootstrap();

    return () => {
      active = false;
      realtimeCleanup.current?.();
    };
  }, [session, userId]);

  useEffect(() => {
    saveItem(`${TASK_CACHE_KEY}:${userId}`, tasks).catch((err) => {
      // Cache writes are best effort, but surface errors to logs.
      console.error("Failed to save tasks to cache", err);
    });
  }, [tasks, userId]);

  useEffect(() => {
    realtimeCleanup.current?.();

    if (!session) return;

    const channel = subscribeToTaskChanges(userId, () => {
      refreshTasks().catch((err) => {
        console.error("Failed to refresh tasks from realtime event", err);
      });
    });

    realtimeCleanup.current = () => unsubscribeFromTaskChanges(channel);
  }, [session, userId]);

  async function syncTasks() {
    try {
      const remoteTasks = await fetchRemoteTasks(userId);
      setTasks(sortTasks(remoteTasks));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function refreshTasks() {
    if (!session) return;
    setRefreshing(true);
    await syncTasks();
  }

  async function createTask(input: TaskInput) {
    const optimisticTask: Task = {
      id: `local-${Date.now()}`,
      userId,
      title: input.title.trim(),
      notes: input.notes.trim(),
      category: input.category,
      dueDate: input.dueDate,
      priority: input.priority,
      completed: input.completed ?? false,
      position: tasks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: !session,
    };

    setTasks((current) => sortTasks([...current, optimisticTask]));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!session) return;

    const remoteTask = await createRemoteTask(userId, input, tasks.length);
    if (!remoteTask) return;

    setTasks((current) =>
      sortTasks(
        current.map((task) =>
          task.id === optimisticTask.id ? remoteTask : task,
        ),
      ),
    );
  }

  async function updateTask(id: string, updates: Partial<TaskInput>) {
    let updatedTask: Task | undefined;

    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;

        updatedTask = {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString(),
          title:
            updates.title !== undefined ? updates.title.trim() : task.title,
          notes:
            updates.notes !== undefined ? updates.notes.trim() : task.notes,
          synced: !session ? true : false,
        };

        return updatedTask!;
      }),
    );

    await Haptics.selectionAsync();

    if (!session || !updatedTask) return;
    const remoteTask = await updateRemoteTask(id, updates);
    if (!remoteTask) return;

    setTasks((current) =>
      current.map((task) => (task.id === id ? remoteTask : task)),
    );
  }

  async function toggleTask(id: string) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  }

  async function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    if (!session) return;
    await deleteRemoteTask(id);
  }

  async function reorderTasks(nextTasks: Task[]) {
    const orderedTasks = nextTasks.map((task, index) => ({
      ...task,
      position: index,
      synced: !session ? true : false,
    }));

    setTasks(orderedTasks);
    await Haptics.selectionAsync();

    if (!session) return;

    await Promise.all(
      orderedTasks.map((task) =>
        task.id.startsWith("local-")
          ? Promise.resolve()
          : updateRemoteTask(task.id, { position: task.position }),
      ),
    );
  }

  const value = useMemo(
    () => ({
      tasks,
      loading,
      refreshing,
      createTask,
      updateTask,
      toggleTask,
      deleteTask,
      reorderTasks,
      refreshTasks,
    }),
    [loading, refreshing, tasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used inside TaskProvider");
  return context;
}
