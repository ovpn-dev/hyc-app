import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert, // Import Alert
  StyleSheet,
} from "react-native";
import { AlertCircle, Phone, MessageSquare } from "lucide-react-native";
import * as Animatable from "react-native-animatable";

export function SOSModal({ visible, onClose }) {
  const CRISIS_LINE_NUMBER = "988";
  const TEXT_CRISIS_LINE_NUMBER = "741741";
  const TEXT_CRISIS_LINE_MESSAGE = "CONVO";

  const handleCall = async () => {
    try {
      await Linking.openURL(`tel:${CRISIS_LINE_NUMBER}`);
    } catch (error) {
      console.error("Error opening phone app:", error);
      Alert.alert("Error", "Could not open the phone app."); // User feedback
    }
  };

  const handleText = async () => {
    try {
      await Linking.openURL(
        `sms:${TEXT_CRISIS_LINE_NUMBER}&body=${TEXT_CRISIS_LINE_MESSAGE}`
      );
    } catch (error) {
      console.error("Error opening messaging app:", error);
      Alert.alert("Error", "Could not open the messaging app."); // User feedback
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Animatable.View
          animation="zoomIn"
          duration={300}
          className="bg-primary rounded-xl w-11/12 max-w-md p-6"
        >
          <View className="items-center mb-4">
            <AlertCircle size={48} color="#FF4444" />
          </View>

          <Text className="text-xl font-bold text-center mb-2">
            Need immediate help?
          </Text>

          <Text className="text-center text-gray-600 mb-6">
            You can reach out to crisis counselors 24/7. All conversations are
            confidential.
          </Text>

          <TouchableOpacity
            onPress={handleCall}
            className="bg-blue-500 rounded-lg p-4 mb-3 flex-row items-center justify-center"
            accessibilityLabel="Call 988 Crisis Lifeline" // Accessibility
          >
            <Phone size={24} color="white" className="mr-2" />
            <Text className="text-white font-semibold text-lg">
              Call {CRISIS_LINE_NUMBER} Crisis Lifeline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleText}
            className="bg-green-500 rounded-lg p-4 mb-6 flex-row items-center justify-center"
            accessibilityLabel="Text Crisis Line" // Accessibility
          >
            <MessageSquare size={24} color="white" className="mr-2" />
            <Text className="text-white font-semibold text-lg">
              Text Crisis Line
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="items-center"
            accessibilityLabel="Close"
          >
            <Text className="text-gray-500 font-medium">Close</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Modal>
  );
}
