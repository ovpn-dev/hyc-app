import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    }}
  >
    <AlertTriangle size={64} color="#EF4444" />
    <Text
      style={{
        color: "#1F2937",
        fontSize: 18,
        textAlign: "center",
        marginTop: 16,
      }}
    >
      {message}
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      style={{
        marginTop: 16,
        backgroundColor: "#2563EB",
        padding: 12,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "white" }}>Retry</Text>
    </TouchableOpacity>
  </View>
);
