import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Platform,
  Image,
  KeyboardAvoidingView,
  AppState,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fetchChatGPTResponse from "../api/fetchGPT";

const STORAGE_KEY = "chat_messages";
const MAX_MESSAGES = 50;
const CONTEXT_WINDOW = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);
  const messageQueueRef = useRef([]);
  const lastMessageTimeRef = useRef(Date.now());
  const appStateRef = useRef(AppState.currentState);

  // Get user data from GlobalProvider
  const { user } = useGlobalContext();

  // Initial setup and message loading
  useEffect(() => {
    if (user) {
      loadMessages();
      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );

      return () => {
        subscription.remove();
        saveMessages(messages);
      };
    }
  }, [user]);

  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0 && user) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleAppStateChange = useCallback(
    (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        loadMessages();

        if (Date.now() - lastMessageTimeRef.current > SESSION_TIMEOUT) {
          const welcomeBackMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: `Welcome back, ${user?.username}! How can I help you today?`,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, welcomeBackMessage]);
        }
      }
      appStateRef.current = nextAppState;
    },
    [user]
  );

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const savedMessages = await AsyncStorage.getItem(
        `${STORAGE_KEY}_${user.$id}`
      );
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      Alert.alert("Error", "Failed to load previous messages");
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessages = async (messagesToSave) => {
    try {
      const trimmedMessages = messagesToSave.slice(-MAX_MESSAGES);
      await AsyncStorage.setItem(
        `${STORAGE_KEY}_${user.$id}`,
        JSON.stringify(trimmedMessages)
      );
    } catch (error) {
      console.error("Error saving messages:", error);
      Alert.alert("Error", "Failed to save messages");
    }
  };

  const retryRequest = async (fn, retries = MAX_RETRIES) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return retryRequest(fn, retries - 1);
      }
      throw error;
    }
  };

  const queueMessage = (message) => {
    return new Promise((resolve, reject) => {
      messageQueueRef.current.push({ message, resolve, reject });
      processMessageQueue();
    });
  };

  const processMessageQueue = async () => {
    if (isProcessing || messageQueueRef.current.length === 0) return;

    setIsProcessing(true);

    try {
      while (messageQueueRef.current.length > 0) {
        const { message, resolve, reject } = messageQueueRef.current[0];
        try {
          const response = await retryRequest(() =>
            fetchChatGPTResponse(
              message,
              messages.slice(-CONTEXT_WINDOW),
              user?.username
            )
          );
          resolve(response);
        } catch (error) {
          reject(error);
        }
        messageQueueRef.current.shift();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isProcessing || !user) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    lastMessageTimeRef.current = Date.now();

    try {
      const botResponse = await queueMessage(input);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
      lastMessageTimeRef.current = Date.now();

      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Chat error:", error);
      Alert.alert("Error", "Failed to send message. Please try again.", [
        { text: "OK" },
      ]);

      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  const renderMessage = useCallback(
    ({ item }) => (
      <View
        className={`flex items-start gap-2 mb-4 px-4 ${
          item.role === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Image
          source={item.role === "user" ? { uri: user?.avatar } : images.aibot}
          className="w-8 h-8 rounded-full"
          resizeMode="cover"
        />
        <View
          className={`rounded-lg px-4 py-2 max-w-[80%] ${
            item.role === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <Text
            selectable={true}
            style={{ color: item.role === "user" ? "white" : "black" }}
          >
            {item.content}
          </Text>
        </View>
      </View>
    ),
    [user?.avatar]
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg text-center">
          Unable to load chat. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View className="flex justify-between items-start flex-row bg-[#161622] shadow-sm p-4">
        <View>
          <Text className="font-pmedium text-sm text-white">
            Welcome back, {user.username}
          </Text>
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
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 mt-5"
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={10}
        windowSize={10}
        onLayout={() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }}
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
            editable={!isProcessing}
          />
          <Pressable
            onPress={sendMessage}
            disabled={isProcessing || !input.trim()}
            className={`p-2 rounded-full ${
              isProcessing || !input.trim()
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Text className="text-white font-semibold">
              {isProcessing ? "Sending..." : "Send"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
