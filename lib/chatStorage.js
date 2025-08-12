// chatStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, StorageHelpers } from "../constants/storage";

// Save chats to AsyncStorage
export const saveChatHistory = async (chatId, messages) => {
  try {
    const allChats = await getAllChats();
    allChats[chatId] = messages;
    await StorageHelpers.setItem(STORAGE_KEYS.CHAT_HISTORY, allChats);
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

// Get all chats from AsyncStorage
export const getAllChats = async () => {
  try {
    return await StorageHelpers.getItem(STORAGE_KEYS.CHAT_HISTORY, {});
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return {};
  }
};

// Delete a specific chat
export const deleteChat = async (chatId) => {
  try {
    const allChats = await getAllChats();
    delete allChats[chatId];
    await StorageHelpers.setItem(STORAGE_KEYS.CHAT_HISTORY, allChats);
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
};

// Save individual chat messages (for user-specific storage)
export const saveChatMessages = async (userId, messages) => {
  try {
    const key = StorageHelpers.getUserSpecificKey(
      STORAGE_KEYS.CHAT_MESSAGES,
      userId
    );
    await StorageHelpers.setItem(key, messages);
  } catch (error) {
    console.error("Error saving chat messages:", error);
  }
};

// Load individual chat messages (for user-specific storage)
export const loadChatMessages = async (userId) => {
  try {
    const key = StorageHelpers.getUserSpecificKey(
      STORAGE_KEYS.CHAT_MESSAGES,
      userId
    );
    return await StorageHelpers.getItem(key, []);
  } catch (error) {
    console.error("Error loading chat messages:", error);
    return [];
  }
};
