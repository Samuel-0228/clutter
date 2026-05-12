import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { readItem, saveItem } from "@/services/storage";
import { AppTheme, ThemeMode, themes } from "@/utils/theme";

const THEME_KEY = "taskapp:theme-mode";

type ThemeContextValue = {
  mode: ThemeMode;
  theme: AppTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    readItem<ThemeMode>(THEME_KEY, "dark").then(setMode);
  }, []);

  async function toggleTheme() {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    await saveItem(THEME_KEY, nextMode);
  }

  const value = useMemo(
    () => ({
      mode,
      theme: themes[mode],
      toggleTheme,
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used inside AppThemeProvider");
  return context;
}
