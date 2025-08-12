// components/NotificationSettings.tsx
import React from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNotifications } from "../app/hooks/useNotifications";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Function to scale font sizes based on screen width
const scaleFont = (size) => {
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
    }
  };

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text
          style={{ fontSize: scaleFont(18) }}
          className="font-semibold text-gray-800"
        >
          Daily Notifications
        </Text>
        <Switch
          value={isEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#2563EB" : "#f4f3f4"}
        />
      </View>

      {isEnabled && (
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className="flex-row justify-between items-center"
        >
          <Text style={{ fontSize: scaleFont(14) }} className="text-gray-600">
            Notification Time
          </Text>
          <Text style={{ fontSize: scaleFont(14) }} className="text-blue-600">
            {notificationTime?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      )}

      {showTimePicker && (
        <DateTimePicker
          value={notificationTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};
