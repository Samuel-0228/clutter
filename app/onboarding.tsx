import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

import { Screen } from "@/components/Screen";
import { useAppTheme } from "@/context/ThemeContext";
import { useOnboarding } from "@/hooks/useOnboarding";

const slides = [
  {
    title: "Organize work without the clutter",
    description:
      "Capture ideas quickly, sort them into categories, and keep the important tasks in view.",
    accent: "Focus",
  },
  {
    title: "Stay in sync across devices",
    description:
      "Supabase powers secure auth, user-specific tasks, and real-time updates whenever your team or your other device makes changes.",
    accent: "Realtime",
  },
  {
    title: "Move fast, even offline",
    description:
      "The app caches your tasks locally, so you can keep working and sync back up when connectivity returns.",
    accent: "Offline-ready",
  },
];

export default function OnboardingScreen() {
  const { theme } = useAppTheme();
  const { completeOnboarding } = useOnboarding();
  const [index, setIndex] = useState(0);
  const current = slides[index];

  const isLastSlide = useMemo(() => index === slides.length - 1, [index]);

  async function handleNext() {
    if (!isLastSlide) {
      setIndex((currentIndex) => currentIndex + 1);
      return;
    }

    await completeOnboarding();
    router.replace("/(auth)/login");
  }

  return (
    <Screen scrollable={false} padded contentContainerStyle={{ justifyContent: "space-between" }}>
      <View style={{ gap: 20 }}>
        <Animated.Text
          entering={FadeInDown.duration(500)}
          style={{
            color: theme.colors.primary,
            fontSize: 14,
            fontWeight: "700",
            letterSpacing: 1.6,
            textTransform: "uppercase",
          }}
        >
          {current.accent}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(80).duration(500)}
          style={{
            color: theme.colors.text,
            fontSize: 38,
            lineHeight: 44,
            fontWeight: "800",
          }}
        >
          {current.title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(140).duration(500)}
          style={{
            color: theme.colors.mutedText,
            fontSize: 17,
            lineHeight: 28,
          }}
        >
          {current.description}
        </Animated.Text>
      </View>

      <View style={{ gap: 28 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {slides.map((slide, slideIndex) => (
            <Animated.View
              entering={FadeInRight.delay(slideIndex * 90)}
              key={slide.accent}
              style={{
                height: 8,
                width: slideIndex === index ? 36 : 8,
                borderRadius: 999,
                backgroundColor:
                  slideIndex === index ? theme.colors.primary : theme.colors.border,
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 18,
            borderRadius: 18,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#08111f",
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            {isLastSlide ? "Get Started" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
