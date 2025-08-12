// constants/storage.js - Complete storage key management
import AsyncStorage from "@react-native-async-storage/async-storage";

// All AsyncStorage keys for the Copey app
export const STORAGE_KEYS = {
  // User-related keys
  USER_NICKNAME: "copey_user_nickname",
  USER_AVATAR: "copey_user_avatar",
  USER_ID: "copey_user_id", // Add this for chat functionality
  IS_NEW_USER: "copey_is_new_user",

  // Notification-related keys
  NOTIFICATION_TIME: "copey_notification_time",
  NOTIFICATIONS_ENABLED: "copey_notifications_enabled",

  // Quote-related keys
  LIKED_QUOTES: "copey_liked_quotes",
  QUOTES_TODAY: "copey_quotes_today",
  QUOTES_RANDOM: "copey_quotes_random",
  QUOTES_TODAY_DATE: "copey_quotes_today_date",
  QUOTES_RANDOM_DATE: "copey_quotes_random_date",

  // Chat-related keys
  CHAT_HISTORY: "copey_chat_history",
  CHAT_MESSAGES: "copey_chat_messages",

  // App state keys
  FIRST_LAUNCH: "copey_first_launch",
  APP_VERSION: "copey_app_version",
};

// Helper functions for type-safe storage operations
export const StorageHelpers = {
  // Get a value and parse it if it's JSON
  async getItem(key, defaultValue = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return defaultValue;

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue;
    }
  },

  // Set a value, automatically stringify if needed
  async setItem(key, value) {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      return false;
    }
  },

  // Remove a key
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  },

  // Clear all app data (useful for logout or reset)
  async clearAppData() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error("Error clearing app data:", error);
      return false;
    }
  },

  // Get user-specific storage key (for chat messages per user)
  getUserSpecificKey(baseKey, userId) {
    return `${baseKey}_${userId}`;
  },

  // Migration helper - rename old keys to new ones
  async migrateKey(oldKey, newKey) {
    try {
      const oldValue = await AsyncStorage.getItem(oldKey);
      if (oldValue !== null) {
        await AsyncStorage.setItem(newKey, oldValue);
        await AsyncStorage.removeItem(oldKey);
        console.log(`Migrated ${oldKey} to ${newKey}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error migrating ${oldKey} to ${newKey}:`, error);
      return false;
    }
  },

  // Migrate all old keys to new consistent format
  async migrateAllKeys() {
    const migrations = [
      // Old key -> New key
      { old: "user_nickname", new: STORAGE_KEYS.USER_NICKNAME },
      { old: "notificationTime", new: STORAGE_KEYS.NOTIFICATION_TIME },
      { old: "notificationsEnabled", new: STORAGE_KEYS.NOTIFICATIONS_ENABLED },
      { old: "likedQuotes", new: STORAGE_KEYS.LIKED_QUOTES },
      { old: "quotes_today", new: STORAGE_KEYS.QUOTES_TODAY },
      { old: "quotes_random", new: STORAGE_KEYS.QUOTES_RANDOM },
      { old: "quotes_today_date", new: STORAGE_KEYS.QUOTES_TODAY_DATE },
      { old: "quotes_random_date", new: STORAGE_KEYS.QUOTES_RANDOM_DATE },
      { old: "chatHistory", new: STORAGE_KEYS.CHAT_HISTORY },
      { old: "chat_messages", new: STORAGE_KEYS.CHAT_MESSAGES },
    ];

    console.log("Starting storage key migration...");
    let migratedCount = 0;

    for (const { old, new: newKey } of migrations) {
      const migrated = await this.migrateKey(old, newKey);
      if (migrated) migratedCount++;
    }

    console.log(`Migration complete. ${migratedCount} keys migrated.`);

    // Mark migration as complete
    await this.setItem("copey_migration_complete", true);

    return migratedCount;
  },
};
