import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Platform,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import fetchChatGPTResponse from "../api/fetchGPT";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { ChevronDown, Plus, Paperclip, Send } from "lucide-react-native";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);

    const botResponse = await fetchChatGPTResponse(input);
    const botMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: botResponse,
    };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");

    // Scroll to bottom after new message
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex justify-between items-start flex-row bg-[#161622] shadow-sm p-4">
        <View>
          <Text className="font-pmedium text-sm text-white">Welcome Back</Text>
          <Text className="text-2xl font-semibold text-white">
            Chat with Copey
          </Text>
        </View>

        <View className="mt-1.5">
          <Image
            source={images.logo}
            className="w-10 h-12"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        ref={flatListRef}
        renderItem={({ item }) => (
          <View
            className={`flex items-start gap-2 mb-4 px-4 ${
              item.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Icon based on message role */}
            {/* <Image
              source={
                item.role === "user"
                  ? images.userIcon // Replace with your user icon
                  : images.aibot // Replace with your assistant icon
              }
              className="w-8 h-8 rounded-full"
              resizeMode="cover"
            /> */}

            {/* Message Bubble */}
            <View
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                item.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <Text>{item.content}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 mt-5"
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="border-t border-gray-200 bg-white p-4"
      >
        <View className="flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="gray"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-white focus:border-blue-500"
          />
          <Pressable
            onPress={sendMessage}
            className="bg-blue-500 p-2 rounded-full hover:bg-blue-600"
          >
            <Text className="text-white font-semibold">Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
