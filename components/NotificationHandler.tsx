import React, { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { AppState } from "react-native";

export function NotificationHandler() {
  const router = useRouter();
  const hasHandledStartupNotification = useRef(false);
  const startupNotificationId = useRef<string | null>(null);
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const setupNotificationHandling = async () => {
      try {
        // Check if app was opened from a notification (cold start)
        const lastNotificationResponse =
          await Notifications.getLastNotificationResponseAsync();

        if (
          lastNotificationResponse &&
          !hasHandledStartupNotification.current
        ) {
          console.log(
            "App started from notification - handling startup navigation"
          );
          hasHandledStartupNotification.current = true;
          startupNotificationId.current =
            lastNotificationResponse.notification.request.identifier;
          handleNotificationNavigation(lastNotificationResponse);
        }
      } catch (error) {
        console.error("Error checking startup notification:", error);
      }

      // Set up listener for all future notification taps
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Notification tapped - handling navigation");

          // Don't handle if we already handled the startup notification and this is the same one
          if (
            hasHandledStartupNotification.current &&
            response.notification.request.identifier ===
              startupNotificationId.current
          ) {
            console.log("Skipping duplicate startup notification");
            return;
          }

          handleNotificationNavigation(response);
        });
    };

    // Small delay to ensure app is fully initialized
    const initTimeout = setTimeout(() => {
      setupNotificationHandling();
    }, 200);

    return () => {
      clearTimeout(initTimeout);
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const handleNotificationNavigation = (
    response: Notifications.NotificationResponse
  ) => {
    const screen = response.notification.request.content.data?.screen;

    if (screen === "Quotes") {
      console.log(`Navigating to ${screen} from notification`);

      // Add delay for smooth navigation
      setTimeout(() => {
        try {
          router.replace("/quotes");
        } catch (error) {
          console.error("Navigation error:", error);
          // Fallback to home if quotes navigation fails
          setTimeout(() => {
            try {
              router.replace("/home");
            } catch (fallbackError) {
              console.error("Fallback navigation also failed:", fallbackError);
            }
          }, 500);
        }
      }, 300);
    } else {
      console.log("Unknown notification screen:", screen);
      // Default fallback - go to home
      setTimeout(() => {
        router.replace("/home");
      }, 300);
    }
  };

  // This component doesn't render anything
  return null;
}
