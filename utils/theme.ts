export type ThemeMode = "dark" | "light";

type ThemePalette = {
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  mutedText: string;
  primary: string;
  primarySoft: string;
  success: string;
  warning: string;
  danger: string;
  dangerSoft: string;
  tabBar: string;
  fabShadow: string;
};

export type AppTheme = {
  mode: ThemeMode;
  statusBar: "light" | "dark";
  colors: ThemePalette;
};

export const themes: Record<ThemeMode, AppTheme> = {
  dark: {
    mode: "dark",
    statusBar: "light",
    colors: {
      background: "#07111f",
      surface: "#0f1b2d",
      card: "#13233a",
      border: "#213452",
      text: "#edf4ff",
      mutedText: "#9fb3cc",
      primary: "#66d9ef",
      primarySoft: "#123447",
      success: "#54d2a3",
      warning: "#f9ba63",
      danger: "#ff7a7a",
      dangerSoft: "#32161d",
      tabBar: "#0d1827",
      fabShadow: "rgba(6, 13, 22, 0.45)",
    },
  },
  light: {
    mode: "light",
    statusBar: "dark",
    colors: {
      background: "#f3f7fb",
      surface: "#ffffff",
      card: "#ffffff",
      border: "#dbe4ef",
      text: "#0d1b2c",
      mutedText: "#60748d",
      primary: "#0ea5b7",
      primarySoft: "#d9f7fb",
      success: "#0f9b74",
      warning: "#c97c17",
      danger: "#d23f57",
      dangerSoft: "#ffe7eb",
      tabBar: "#ffffff",
      fabShadow: "rgba(18, 42, 66, 0.15)",
    },
  },
};
