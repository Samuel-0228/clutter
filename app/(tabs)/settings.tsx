import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, Switch, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { SettingsRow } from "@/components/SettingsRow";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useTaskManager } from "@/hooks/useTaskManager";
import { useNotifications } from "@/hooks/useNotifications";

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useAppTheme();
  const { signOut, isDemoMode, user } = useAuth();
  const { stats } = useTaskManager();
  const { pushToken, registerForPush, statusMessage, supported } = useNotifications();

  async function handleLogout() {
    await signOut();
    router.replace("/(auth)/login");
  }

  return (
    <Screen
      title="Profile & Settings"
      subtitle="Manage your account, theme, notifications, and workspace preferences."
      padded
    >
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: 24,
          padding: 20,
          gap: 18,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.colors.surface,
            }}
          >
            <Ionicons name="person" size={24} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700" }}>
              {user?.email ?? "Demo user"}
            </Text>
            <Text style={{ color: theme.colors.mutedText, fontSize: 14 }}>
              {isDemoMode ? "Offline demo mode" : "Supabase account"}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: 18,
              padding: 14,
            }}
          >
            <Text style={{ color: theme.colors.mutedText, fontSize: 13 }}>Open tasks</Text>
            <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "800" }}>
              {stats.pending}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: 18,
              padding: 14,
            }}
          >
            <Text style={{ color: theme.colors.mutedText, fontSize: 13 }}>Completed</Text>
            <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "800" }}>
              {stats.completed}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        <SettingsRow
          icon="sunny"
          title="Light theme"
          description="Switch between dark and light modes."
          rightNode={<Switch value={mode === "light"} onValueChange={toggleTheme} />}
        />
        <SettingsRow
          icon="notifications"
          title="Push notifications"
          description={pushToken ? "Notifications are ready." : statusMessage}
          rightNode={
            <Pressable onPress={registerForPush} disabled={pushToken !== null && !supported}>
              <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
                {pushToken ? "Enabled" : supported ? "Enable" : "Info"}
              </Text>
            </Pressable>
          }
        />
        <SettingsRow
          icon="cloud-upload"
          title="Backend mode"
          description={
            isDemoMode
              ? "Running in demo mode until Supabase keys are added."
              : "Connected to Supabase with real-time sync."
          }
        />
      </View>

      <Pressable
        onPress={handleLogout}
        style={{
          marginTop: 24,
          paddingVertical: 18,
          borderRadius: 18,
          backgroundColor: theme.colors.dangerSoft,
          alignItems: "center",
        }}
      >
        <Text style={{ color: theme.colors.danger, fontSize: 16, fontWeight: "800" }}>
          Log Out
        </Text>
      </Pressable>
    </Screen>
  );
}
