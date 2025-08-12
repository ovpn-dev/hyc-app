import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Handle notification interactions ONLY when app is already running
    // App startup from notifications is handled in index.jsx
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        console.log("NotificationHandler: In-app navigation to", screen);

        // This only handles notifications when app is already running
        // NOT when app starts from a notification (that's handled in index.jsx)
        if (screen === "Quotes") {
          try {
            console.log("Navigating to quotes from in-app notification");
            // Immediate navigation since app is already running
            router.push("/quotes"); // Using push instead of replace for in-app navigation
          } catch (error) {
            console.error("In-app navigation error:", error);
          }
        }
      }
    );

    return () => {
      subscription?.remove();
    };
  }, [router]);

  // This component doesn't render anything
  return null;
}
