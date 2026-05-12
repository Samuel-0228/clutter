import { useEffect, useState } from "react";

import { readItem, saveItem } from "@/services/storage";

const ONBOARDING_KEY = "taskapp:onboarding-complete";

export function useOnboarding() {
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readItem<boolean>(ONBOARDING_KEY, false)
      .then(setCompleted)
      .finally(() => setIsLoading(false));
  }, []);

  async function completeOnboarding() {
    setCompleted(true);
    await saveItem(ONBOARDING_KEY, true);
  }

  return {
    completed,
    isLoading,
    completeOnboarding,
  };
}
