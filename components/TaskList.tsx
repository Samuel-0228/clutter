import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { Task } from "@/types/task";

import { TaskCard } from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onReorder: (tasks: Task[]) => Promise<void>;
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
};

export function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onReorder,
  refreshing,
  onRefresh,
}: TaskListProps) {
  function renderItem({ item, drag }: RenderItemParams<Task>) {
    return (
      <ScaleDecorator>
        <TaskCard
          task={item}
          onToggle={() => void onToggleTask(item.id)}
          onDelete={() => void onDeleteTask(item.id)}
          onDrag={drag}
        />
      </ScaleDecorator>
    );
  }

  return (
    <DraggableFlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onDragEnd={({ data }) => void onReorder(data)}
      activationDistance={12}
      contentContainerStyle={{ paddingBottom: 180 }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={7}
      refreshing={refreshing}
      onRefresh={onRefresh ? () => void onRefresh() : undefined}
    />
  );
}
