// components/NotificationSettings.tsx
import React from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNotifications } from "../app/hooks/useNotifications";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Function to scale font sizes based on screen width
const scaleFont = (size: number) => {
  const baseWidth = 375; // Reference width (e.g., iPhone 8)
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

export const NotificationSettings = () => {
  const {
    notificationTime,
    isEnabled,
    updateNotificationTime,
    toggleNotifications,
  } = useNotifications();
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      updateNotificationTime(selectedDate);

      // Show confirmation to user
      if (Platform.OS === "android") {
        Alert.alert(
          "Notification Time Updated",
          `Daily quotes will be delivered at ${selectedDate.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}`,
          [{ text: "OK" }]
        );
      }
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      await toggleNotifications(enabled);

      if (enabled) {
        Alert.alert(
          "Notifications Enabled",
          `You'll receive daily quotes at ${notificationTime?.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Notifications Disabled",
          "You won't receive daily quote notifications",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update notification settings. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleTimePress = () => {
    if (!isEnabled) {
      Alert.alert(
        "Enable Notifications",
        "Please enable notifications first to set the time",
        [{ text: "OK" }]
      );
      return;
    }
    setShowTimePicker(true);
  };

  return (
    <View className="p-4 bg-white rounded-lg mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <Text
            style={{ fontSize: scaleFont(18) }}
            className="font-semibold text-gray-800"
          >
            Daily Notifications
          </Text>
          <Text
            style={{ fontSize: scaleFont(12) }}
            className="text-gray-500 mt-1"
          >
            Get inspired with daily quotes
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#2563EB" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      {isEnabled && (
        <TouchableOpacity
          onPress={handleTimePress}
          className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg"
          activeOpacity={0.7}
        >
          <Text
            style={{ fontSize: scaleFont(14) }}
            className="text-gray-700 font-medium"
          >
            Notification Time
          </Text>
          <Text
            style={{ fontSize: scaleFont(14) }}
            className="text-blue-600 font-semibold"
          >
            {notificationTime?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) || "9:00 AM"}
          </Text>
        </TouchableOpacity>
      )}

      {showTimePicker && notificationTime && (
        <View className="mt-4">
          <DateTimePicker
            value={notificationTime}
            mode="time"
            is24Hour={false} // Changed to 12-hour for better UX
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
            themeVariant="light"
          />
        </View>
      )}

      {isEnabled && (
        <View className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Text
            style={{ fontSize: scaleFont(12) }}
            className="text-blue-700 text-center"
          >
            💡 Notifications will be delivered daily at the selected time
          </Text>
        </View>
      )}
    </View>
  );
};
