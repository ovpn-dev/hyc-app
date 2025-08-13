// hooks/useNotifications.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { STORAGE_KEYS, StorageHelpers } from "../../constants/storage"; // Import the constants

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const [notificationTime, setNotificationTime] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const notificationListener = useRef<Notifications.Subscription>();

  // Register for push notifications
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily-quotes", {
        name: "Daily Quotes",
        importance: Notifications.AndroidImportance.HIGH, // Changed from MAX for SDK 52
        vibrationPattern: [0, 250, 250, 250],
        sound: true, // Explicitly set sound for SDK 52
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert(
          "Failed to get permissions for notifications. Daily quotes will not be scheduled."
        );
        return;
      }

      try {
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: "8e2b3e23-1ce4-4fb7-abca-e0c67ab99565",
          })
        ).data;
        console.log("Expo Push Token:", token);
      } catch (e) {
        console.warn(
          "Could not get Expo push token. This is not required for local notifications.",
          e
        );
      }
    }

    return token;
  }

  // Schedule notification for the specified time (Updated for SDK 52)
  const scheduleNotification = async (time: Date) => {
    try {
      // Cancel any existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("Cancelled all existing notifications");

      let notificationId;

      if (Platform.OS === "ios") {
        // iOS: Use calendar trigger
        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Your Daily Quote Is Here!",
            body: "Tap to view today's inspiration",
            data: { screen: "Quotes" },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: time.getHours(),
            minute: time.getMinutes(),
            repeats: true,
          },
        });
        console.log(
          `iOS: Calendar trigger scheduled for ${time.toLocaleTimeString()}`
        );
      } else {
        // Android: Use date-based trigger with manual daily scheduling
        const now = new Date();
        const scheduleTime = new Date();
        scheduleTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

        // If the time has already passed today, schedule for tomorrow
        if (scheduleTime <= now) {
          scheduleTime.setDate(scheduleTime.getDate() + 1);
        }

        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Your Daily Quote Is Here!",
            body: "Tap to view today's inspiration",
            data: { screen: "Quotes" },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: scheduleTime,
          },
        });

        console.log(
          `Android: Date trigger scheduled for ${scheduleTime.toLocaleString()}`
        );

        // For Android, we need to schedule multiple notifications for the "daily" effect
        // Schedule for the next 30 days
        for (let i = 1; i <= 30; i++) {
          const futureDate = new Date(scheduleTime);
          futureDate.setDate(scheduleTime.getDate() + i);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Your Daily Quote Is Here!",
              body: "Tap to view today's inspiration",
              data: { screen: "Quotes" },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: futureDate,
            },
          });
        }
        console.log(
          `Android: Scheduled 31 daily notifications starting from ${scheduleTime.toLocaleString()}`
        );
      }

      // Verify scheduling
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log(
        `Total scheduled notifications: ${scheduledNotifications.length}`
      );

      return notificationId;
    } catch (error) {
      console.error("Failed to schedule notification:", error);
      throw error;
    }
  };

  // Load saved notification preferences
  const loadNotificationPreferences = async () => {
    try {
      // Use consistent storage keys
      const savedTime = await StorageHelpers.getItem(
        STORAGE_KEYS.NOTIFICATION_TIME
      );
      const savedEnabled = await StorageHelpers.getItem(
        STORAGE_KEYS.NOTIFICATIONS_ENABLED,
        false
      );

      if (savedTime) {
        const time = new Date(savedTime);
        setNotificationTime(time);
      } else {
        // Default to 9:00 AM
        const defaultTime = new Date();
        defaultTime.setHours(9, 0, 0, 0);
        setNotificationTime(defaultTime);
      }

      setIsEnabled(savedEnabled);

      return {
        time: savedTime ? new Date(savedTime) : null,
        enabled: savedEnabled,
      };
    } catch (error) {
      console.error("Error loading notification preferences:", error);
      const defaultTime = new Date();
      defaultTime.setHours(9, 0, 0, 0);
      setNotificationTime(defaultTime);
      setIsEnabled(false);
      return { time: defaultTime, enabled: false };
    }
  };

  // Toggle notifications
  const toggleNotifications = async (enabled: boolean) => {
    try {
      setIsEnabled(enabled);

      if (enabled && notificationTime) {
        await scheduleNotification(notificationTime);
        console.log("Notifications enabled and scheduled");
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log(
          "Notifications disabled. All scheduled notifications cancelled."
        );
      }

      // Use consistent storage key
      await StorageHelpers.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled);
    } catch (error) {
      console.error("Error toggling notifications:", error);
      setIsEnabled(!enabled); // Revert on error
    }
  };

  // Update notification time
  const updateNotificationTime = async (newTime: Date) => {
    try {
      setNotificationTime(newTime);
      // Use consistent storage key
      await StorageHelpers.setItem(
        STORAGE_KEYS.NOTIFICATION_TIME,
        newTime.toISOString()
      );

      if (isEnabled) {
        await scheduleNotification(newTime);
        console.log(
          `Notification time updated to ${newTime.toLocaleTimeString()}`
        );
      }
    } catch (error) {
      console.error("Error updating notification time:", error);
    }
  };

  // Helper function to check and renew Android notifications
  const checkAndRenewAndroidNotifications = async () => {
    if (Platform.OS !== "android" || !isEnabled || !notificationTime) {
      return;
    }

    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log(
        `Current scheduled notifications: ${scheduledNotifications.length}`
      );

      // If we have fewer than 7 days of notifications left, renew
      if (scheduledNotifications.length < 7) {
        console.log("Renewing Android notifications...");
        await scheduleNotification(notificationTime);
      }
    } catch (error) {
      console.error("Error checking/renewing Android notifications:", error);
    }
  };

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
        }

        const { time, enabled } = await loadNotificationPreferences();

        // If notifications are enabled and we have a time, ensure they're scheduled
        if (enabled && time) {
          const scheduled =
            await Notifications.getAllScheduledNotificationsAsync();
          console.log(`Found ${scheduled.length} scheduled notifications`);

          if (scheduled.length === 0) {
            console.log("No notifications scheduled. Setting up notification.");
            await scheduleNotification(time);
          } else {
            console.log("Notifications already scheduled");
            // For Android, check if we need to renew notifications
            if (Platform.OS === "android" && scheduled.length < 7) {
              console.log("Android notifications running low, renewing...");
              await scheduleNotification(time);
            }
          }
        }

        // Set up a periodic check for Android notification renewal (every 24 hours)
        if (Platform.OS === "android") {
          const renewalInterval = setInterval(
            checkAndRenewAndroidNotifications,
            24 * 60 * 60 * 1000
          );
          return () => clearInterval(renewalInterval);
        }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    setupNotifications();

    // Listen for incoming notifications when app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "Notification received in foreground:",
          notification.request.content.body
        );
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
    };
  }, []);

  return {
    notificationTime,
    isEnabled,
    updateNotificationTime,
    toggleNotifications,
    checkAndRenewAndroidNotifications, // Expose for manual renewal if needed
  };
};
