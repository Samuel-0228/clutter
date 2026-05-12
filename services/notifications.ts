import Constants from "expo-constants";
import { Platform } from "react-native";

type PushRegistrationResult = {
  token: string | null;
  message: string;
  supported: boolean;
};

function isExpoGo() {
  return Constants.appOwnership === "expo";
}

export async function registerForPushNotificationsAsync(): Promise<PushRegistrationResult> {
  if (isExpoGo()) {
    return {
      token: null,
      supported: false,
      message: "Push notifications require a development build or production app, not Expo Go.",
    };
  }

  const [{ default: Device }, Notifications] = await Promise.all([
    import("expo-device"),
    import("expo-notifications"),
  ]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (!Device.isDevice) {
    return {
      token: null,
      supported: false,
      message: "Push notifications need a physical device.",
    };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return {
      token: null,
      supported: false,
      message: "Notification permission was not granted.",
    };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();

  return {
    token: token.data,
    supported: true,
    message: "Notifications are ready.",
  };
}
