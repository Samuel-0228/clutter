import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/context/ThemeContext";

type ScreenProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  padded?: boolean;
  scrollable?: boolean;
  rightAccessory?: ReactNode;
  contentContainerStyle?: object;
};

export function Screen({
  children,
  title,
  subtitle,
  padded = false,
  scrollable = true,
  rightAccessory,
  contentContainerStyle,
}: ScreenProps) {
  const { theme } = useAppTheme();
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Container
        style={{ flex: 1 }}
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingHorizontal: padded ? 20 : 0,
            paddingTop: 16,
            paddingBottom: 120,
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {(title || subtitle || rightAccessory) && (
          <View
            style={{
              marginBottom: 22,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <View style={{ flex: 1, gap: 8 }}>
              {title ? (
                <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: "800" }}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text style={{ color: theme.colors.mutedText, fontSize: 15, lineHeight: 23 }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {rightAccessory}
          </View>
        )}
        {children}
      </Container>
    </SafeAreaView>
  );
}
