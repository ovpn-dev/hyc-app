// hooks/useQuotes.ts
import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "../api/api-service";
import { STORAGE_KEYS, StorageHelpers } from "../../constants/storage";

export const useQuotes = (type: "today" | "random") => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get the appropriate storage keys based on type
  const getStorageKeys = useCallback((quoteType: "today" | "random") => {
    return {
      quotes:
        quoteType === "today"
          ? STORAGE_KEYS.QUOTES_TODAY
          : STORAGE_KEYS.QUOTES_RANDOM,
      date:
        quoteType === "today"
          ? STORAGE_KEYS.QUOTES_TODAY_DATE
          : STORAGE_KEYS.QUOTES_RANDOM_DATE,
    };
  }, []);

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { quotes: quotesKey, date: dateKey } = getStorageKeys(type);

      // Try to get cached quotes first
      const cachedQuotes = await StorageHelpers.getItem(quotesKey);
      if (cachedQuotes && type === "today") {
        const cacheDate = await StorageHelpers.getItem(dateKey);

        // Only use cache if it's from today
        if (cacheDate === new Date().toDateString()) {
          setQuotes(cachedQuotes);
          setLoading(false);
          return;
        }
      }

      const fetchedQuotes = await apiService.fetchQuotes(type);

      if (fetchedQuotes.length > 0) {
        setQuotes(fetchedQuotes);

        // Cache today's quotes
        if (type === "today") {
          await StorageHelpers.setItem(quotesKey, fetchedQuotes);
          await StorageHelpers.setItem(dateKey, new Date().toDateString());
        }
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch quotes"
      );

      // Try to use cached quotes as fallback
      const { quotes: quotesKey } = getStorageKeys(type);
      const cachedQuotes = await StorageHelpers.getItem(quotesKey);
      if (cachedQuotes) {
        setQuotes(cachedQuotes);
      }
    } finally {
      setLoading(false);
    }
  }, [type, getStorageKeys]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQuotes();
    setRefreshing(false);
  }, [fetchQuotes]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    loading,
    error,
    refreshing,
    onRefresh,
    refetch: fetchQuotes,
  };
};
