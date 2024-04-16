import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getUsersForNotification } from "../Firebase/firestoreHelper";


export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const getProjectId = Constants.expoConfig.extra.eas.projectId;

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: getProjectId,
  });
  // const tokenData = await Notifications.getExpoPushTokenAsync();
  const getToken = tokenData.data;
  console.log("Token Data", tokenData, "getToken", getToken);

  return getToken;
}

export async function newAlertNotification( notificationData) {
  async function verifyPermission() {
    const permissionInfo = await Notifications.getPermissionsAsync();
    if (permissionInfo.granted) {
      return true;
    }
    const response = await Notifications.requestPermissionsAsync();
    return response.granted;
  }

  try {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      console.warn("You need to give permission for notification");
      return;
    }

    const userTokens = await getUsersForNotification(notificationData.level);

    const notificationBody = `Emergency Level: ${notificationData.level}, Location: ${notificationData.area}, Issue Type: ${notificationData.issueType}`;

    // Track the tokens that have been notified
    let notifiedTokens = new Set();

    userTokens.forEach(async (token) => {
      // Skip if the token has already been notified
      if (notifiedTokens.has(token)) {
        console.log(`Notification already sent to token: ${token}`);
        return;
      }

      const message = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          to: token,
          sound: "default",
          title: "New Alert Notification",
          body: notificationBody
        }),
      });

      if (message.ok) {
        console.log("Push notification sent successfully to token:", token);
        // Add token to the notified set
        notifiedTokens.add(token);
      } else {
        console.error("Failed to send notification to token:", token);
      }
    });

  } catch (err) {
    console.error("Error sending notification:", err);
  }
}
