import AsyncStorage from "@react-native-async-storage/async-storage";

// Save chats to AsyncStorage
export const saveChatHistory = async (chatId, messages) => {
  try {
    const allChats = await getAllChats();
    allChats[chatId] = messages;
    await AsyncStorage.setItem("chatHistory", JSON.stringify(allChats));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

// Get all chats from AsyncStorage
export const getAllChats = async () => {
  try {
    const chats = await AsyncStorage.getItem("chatHistory");
    return chats ? JSON.parse(chats) : {};
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
    await AsyncStorage.setItem("chatHistory", JSON.stringify(allChats));
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
};
