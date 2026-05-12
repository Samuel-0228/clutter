import { useEffect, useState } from "react";

import { registerForPushNotificationsAsync } from "@/services/notifications";
import { readItem, saveItem } from "@/services/storage";

const PUSH_TOKEN_KEY = "taskapp:push-token";

export function useNotifications() {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Enable reminders on this device.");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    readItem<string | null>(PUSH_TOKEN_KEY, null).then(setPushToken);
  }, []);

  async function registerForPush() {
    const result = await registerForPushNotificationsAsync();
    setStatusMessage(result.message);
    setSupported(result.supported);

    if (!result.token) return null;

    setPushToken(result.token);
    await saveItem(PUSH_TOKEN_KEY, result.token);
    return result.token;
  }

  return { pushToken, registerForPush, statusMessage, supported };
}
