// GlobalProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLikedQuotes } from "../app/hooks/useLikedQuotes";
import { STORAGE_KEYS, StorageHelpers } from "../constants/storage";

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
    $id: null, // Add this for chat functionality compatibility
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

  // Function to generate a unique user ID
  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

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

      // Generate or get existing user ID
      let userId = await StorageHelpers.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) {
        userId = generateUserId();
        await StorageHelpers.setItem(STORAGE_KEYS.USER_ID, userId);
      }

      // Save nickname to AsyncStorage using consistent key
      const nicknameSuccess = await StorageHelpers.setItem(
        STORAGE_KEYS.USER_NICKNAME,
        trimmedNickname
      );

      if (nicknameSuccess) {
        // Update user state
        setUser({
          $id: userId, // This is what chat needs
          username: trimmedNickname,
          avatar: generateAvatarUrl(trimmedNickname),
        });

        // Mark user as not new
        setIsNewUser(false);
        await StorageHelpers.setItem(STORAGE_KEYS.IS_NEW_USER, false);

        return true;
      }

      return false;
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

        // Check if migration is needed (only run once)
        const migrationComplete = await StorageHelpers.getItem(
          "copey_migration_complete",
          false
        );
        if (!migrationComplete) {
          console.log("Running storage key migration...");
          await StorageHelpers.migrateAllKeys();
        }

        // Check if user has used the app before (has a nickname)
        const savedNickname = await StorageHelpers.getItem(
          STORAGE_KEYS.USER_NICKNAME
        );
        const savedIsNewUser = await StorageHelpers.getItem(
          STORAGE_KEYS.IS_NEW_USER,
          true
        );

        // Get or generate user ID
        let userId = await StorageHelpers.getItem(STORAGE_KEYS.USER_ID);
        if (!userId) {
          userId = generateUserId();
          await StorageHelpers.setItem(STORAGE_KEYS.USER_ID, userId);
        }

        if (savedNickname) {
          // User has a saved nickname
          setUser({
            $id: userId,
            username: savedNickname,
            avatar: generateAvatarUrl(savedNickname),
          });
          setIsNewUser(false);
        } else {
          // First time user, but still set user ID
          setUser((prev) => ({
            ...prev,
            $id: userId,
          }));
          setIsNewUser(true);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        // Ensure user always has an ID even if other things fail
        const fallbackId = generateUserId();
        setUser((prev) => ({
          ...prev,
          $id: fallbackId,
        }));
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
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
