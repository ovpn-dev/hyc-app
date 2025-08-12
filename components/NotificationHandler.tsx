import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Handle notification interactions
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        console.log("NotificationHandler: navigating to", screen);

        // Navigate to the specified screen
        if (screen === "Quotes") {
          try {
            // Add a small delay to ensure app state is settled
            setTimeout(() => {
              console.log("Navigating to quotes from notification");
              router.replace("/quotes");
            }, 100);
          } catch (error) {
            console.error("Navigation error:", error);
            // Fallback navigation attempt with longer delay
            setTimeout(() => {
              router.replace("/quotes");
            }, 1000);
          }
        }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(subscription);
    };
  }, [router]);

  // This component doesn't render anything
  return null;
}
