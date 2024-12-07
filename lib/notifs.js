import * as Notifications from "expo-notifications";
import { useEffect } from "react";

const scheduleDailyNotification = async (quote) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Today's Quote",
      body: quote.q,
      data: { quote },
    },
    trigger: { hour: 9, minute: 0, repeats: true },
  });
};

const requestPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
};

useEffect(() => {
  requestPermissions();
  fetch(`https://zenquotes.io/api/today`)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        scheduleDailyNotification(data[0]);
      }
    })
    .catch((error) => console.error("Error scheduling notification:", error));
}, []);
