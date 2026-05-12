import { RealtimeChannel } from "@supabase/supabase-js";

import { Task, TaskInput } from "@/types/task";

import { isSupabaseConfigured, supabase } from "./supabase";

type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  completed: boolean;
  category: string;
  due_date: string | null;
  priority: string;
  position: number;
  created_at: string;
  updated_at: string;
};

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    notes: row.notes ?? "",
    completed: row.completed,
    category: row.category as Task["category"],
    dueDate: row.due_date,
    priority: row.priority as Task["priority"],
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    synced: true,
  };
}

export async function fetchRemoteTasks(userId: string) {
  if (!isSupabaseConfigured || !supabase) return [] as Task[];

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function createRemoteTask(userId: string, input: TaskInput, position: number) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: input.title,
      notes: input.notes,
      completed: input.completed ?? false,
      category: input.category,
      due_date: input.dueDate,
      priority: input.priority,
      position,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function updateRemoteTask(id: string, updates: Partial<TaskInput> & { position?: number }) {
  if (!isSupabaseConfigured || !supabase) return null;

  const payload: Record<string, unknown> = {};

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.completed !== undefined) payload.completed = updates.completed;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.position !== undefined) payload.position = updates.position;

  const { data, error } = await supabase
    .from("tasks")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function deleteRemoteTask(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export function subscribeToTaskChanges(userId: string, onChange: () => void) {
  if (!isSupabaseConfigured || !supabase) return null;

  const channel: RealtimeChannel = supabase
    .channel(`tasks:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
        filter: `user_id=eq.${userId}`,
      },
      onChange,
    )
    .subscribe();

  return channel;
}

export function unsubscribeFromTaskChanges(channel: RealtimeChannel | null) {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}
