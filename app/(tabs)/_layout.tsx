import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { useAppTheme } from "@/context/ThemeContext";

export default function TabsLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 18,
          height: 72,
          borderRadius: 24,
          paddingTop: 12,
          backgroundColor: theme.colors.tabBar,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "grid" : "grid-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Completed",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "checkmark-done-circle" : "checkmark-done-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
