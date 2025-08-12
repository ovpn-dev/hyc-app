// GlobalProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationHandler } from "../components/NotificationHandler";
import { useLikedQuotes } from "../app/hooks/useLikedQuotes";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  // Track loading state for initial data loading
  const [loading, setLoading] = useState(true);
  // Set isLogged to true by default (since we've removed auth)
  const [isLogged, setIsLogged] = useState(true);
  // Track if this is a first-time user
  const [isNewUser, setIsNewUser] = useState(true);
  // User state with default values
  const [user, setUser] = useState({
    username: "Guest User",
    avatar:
      "https://ui-avatars.com/api/?name=Guest+User&background=random&color=fff",
  });

  // Use the liked quotes hook
  const {
    likedQuotes,
    loading: quotesLoading,
    addLikedQuote,
    removeLikedQuote,
    isQuoteLiked,
  } = useLikedQuotes();

  // Function to create avatar URL from nickname
  const generateAvatarUrl = (nickname) => {
    const formattedName = nickname.replace(/\s+/g, "+");
    return `https://ui-avatars.com/api/?name=${formattedName}&background=random&color=fff`;
  };

  // Function to save nickname to AsyncStorage and update user state
  const saveNickname = async (nickname) => {
    try {
      setLoading(true);
      const trimmedNickname = nickname.trim();

      // Save to AsyncStorage
      await AsyncStorage.setItem("user_nickname", trimmedNickname);

      // Update user state
      setUser({
        username: trimmedNickname,
        avatar: generateAvatarUrl(trimmedNickname),
      });

      // Mark user as not new
      setIsNewUser(false);

      return true;
    } catch (error) {
      console.error("Error saving nickname:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load saved nickname on app startup
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        // Check if user has used the app before (has a nickname)
        const savedNickname = await AsyncStorage.getItem("user_nickname");

        if (savedNickname) {
          // User has a saved nickname
          setUser({
            username: savedNickname,
            avatar: generateAvatarUrl(savedNickname),
          });
          setIsNewUser(false);
        } else {
          // First time user
          setIsNewUser(true);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        setLoading,
        isNewUser,
        setIsNewUser,
        saveNickname, // Expose this function to components
        // Liked quotes functionality
        likedQuotes,
        addLikedQuote,
        removeLikedQuote,
        isQuoteLiked,
      }}
    >
      <NotificationHandler />
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
