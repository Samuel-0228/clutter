import "react-native-reanimated";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/AuthContext";
import { AppThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { TaskProvider } from "@/context/TaskContext";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore duplicate calls during fast refresh.
});

function RootNavigator() {
  const { theme } = useAppTheme();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      // Ignore splash hide timing races during development.
    });
  }, []);

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: "fade_from_bottom",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <AuthProvider>
            <TaskProvider>
              <RootNavigator />
            </TaskProvider>
          </AuthProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
