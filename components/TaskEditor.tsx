import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { Platform, Pressable, Switch, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useAppTheme } from "@/context/ThemeContext";
import { TASK_CATEGORIES, TASK_PRIORITIES, Task, TaskInput } from "@/types/task";
import { createEmptyTaskInput, toTaskInput } from "@/utils/task";

type TaskEditorProps = {
  initialTask?: Task;
  submitLabel: string;
  onSubmit: (input: TaskInput) => Promise<void>;
};

export function TaskEditor({ initialTask, submitLabel, onSubmit }: TaskEditorProps) {
  const { theme } = useAppTheme();
  const [values, setValues] = useState<TaskInput>(initialTask ? toTaskInput(initialTask) : createEmptyTaskInput());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dueDateLabel = useMemo(() => {
    if (!values.dueDate) return "No due date selected";
    return new Date(values.dueDate).toLocaleDateString();
  }, [values.dueDate]);

  function onDateChange(_event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }

    if (!date) return;
    setValues((current) => ({ ...current, dueDate: date.toISOString() }));
  }

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Title</Text>
        <TextInput
          value={values.title}
          onChangeText={(title) => setValues((current) => ({ ...current, title }))}
          placeholder="What needs to get done?"
          placeholderTextColor={theme.colors.mutedText}
          style={{
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Notes</Text>
        <TextInput
          multiline
          value={values.notes}
          onChangeText={(notes) => setValues((current) => ({ ...current, notes }))}
          placeholder="Add details, links, or reminders"
          placeholderTextColor={theme.colors.mutedText}
          style={{
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            minHeight: 110,
            textAlignVertical: "top",
          }}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Category</Text>
        <View
          style={{
            borderRadius: 18,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
          }}
        >
          <Picker
            selectedValue={values.category}
            onValueChange={(category) => setValues((current) => ({ ...current, category }))}
            dropdownIconColor={theme.colors.text}
            style={{ color: theme.colors.text }}
          >
            {TASK_CATEGORIES.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Priority</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {TASK_PRIORITIES.map((priority) => {
            const active = values.priority === priority;

            return (
              <Pressable
                key={priority}
                onPress={() => setValues((current) => ({ ...current, priority }))}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: "center",
                  backgroundColor: active ? theme.colors.primary : theme.colors.card,
                  borderWidth: 1,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                }}
              >
                <Text
                  style={{
                    color: active ? "#08111f" : theme.colors.text,
                    textTransform: "capitalize",
                    fontWeight: "700",
                  }}
                >
                  {priority}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          gap: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Due date</Text>
            <Text style={{ color: theme.colors.mutedText }}>{dueDateLabel}</Text>
          </View>
          <Pressable onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>Choose</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Mark completed</Text>
            <Text style={{ color: theme.colors.mutedText }}>Useful while editing finished tasks.</Text>
          </View>
          <Switch
            value={Boolean(values.completed)}
            onValueChange={(completed) => setValues((current) => ({ ...current, completed }))}
          />
        </View>
      </View>

      {showDatePicker ? (
        <DateTimePicker
          value={values.dueDate ? new Date(values.dueDate) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      ) : null}

      <Pressable
        onPress={() => onSubmit(values)}
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: 18,
          borderRadius: 18,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#08111f", fontWeight: "800", fontSize: 16 }}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}
