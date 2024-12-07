import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomChat } from "../../lib/useCustomChat";
import { ChevronDown, Plus, Paperclip, Send } from "lucide-react-native";

export default function Create() {
  const [model, setModel] = useState("GPT 4o mini");
  const { messages, input, handleInputChange, handleSubmit } = useCustomChat();

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-800">
        <View className="flex-row items-center">
          <Text className="text-white font-bold mr-2">{model}</Text>
          <ChevronDown color="white" size={20} />
        </View>
        <TouchableOpacity className="flex-row items-center bg-gray-800 rounded-md px-3 py-2">
          <Plus color="white" size={20} />
          <Text className="text-white ml-2">New Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-600 rounded-md px-4 py-2">
          <Text className="text-white font-bold">Login</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5">
        {messages.length === 0 ? (
          <View className="items-center justify-center flex-1">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-white rounded-full mr-2" />
              <View className="w-12 h-12 bg-white rounded-full" />
            </View>
            <Text className="text-white text-center text-lg mb-4">
              This is an open source chatbot template built with React Native
              and the AI SDK by Vercel.
            </Text>
            <Text className="text-white text-center">
              You can learn more about the AI SDK by visiting the{" "}
              <Text className="underline">docs</Text>.
            </Text>
          </View>
        ) : (
          messages.map((message, index) => (
            <View key={index} className="mb-4">
              <Text
                className={`text-${
                  message.role === "user" ? "blue-400" : "green-400"
                } mb-2`}
              >
                {message.role === "user" ? "You" : "AI"}
              </Text>
              <Text className="text-white">{message.content}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <View className="p-4 border-t border-gray-800">
        <View className="flex-row items-center bg-gray-800 rounded-lg p-2">
          <TextInput
            className="flex-1 text-white"
            placeholder="Send a message..."
            placeholderTextColor="#6B7280"
            value={input}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity className="mr-2">
            <Paperclip color="white" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}>
            <Send color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
