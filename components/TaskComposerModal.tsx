import { Modal, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";
import { TaskInput } from "@/types/task";

import { TaskEditor } from "./TaskEditor";

export function TaskComposerModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
}) {
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20, paddingTop: 60 }}>
        <View
          style={{
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: "800" }}>New Task</Text>
          <Pressable onPress={onClose}>
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>Close</Text>
          </Pressable>
        </View>
        <TaskEditor
          submitLabel="Create Task"
          onSubmit={async (values) => {
            await onSubmit(values);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
}
