import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MessageCircle,
  Heart,
  RefreshCw,
  AlertTriangle,
  WifiOff,
} from "lucide-react-native";
import NetInfo from "@react-native-community/netinfo";

// TypeScript interface for Quote
interface Quote {
  q: string;
  a: string;
}

export default function QuotesScreen() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quoteType, setQuoteType] = useState<"today" | "random">("today");
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  // Fallback quotes for when API fails
  const FALLBACK_QUOTES: Quote[] = [
    {
      q: "The only way to do great work is to love what you do.",
      a: "Steve Jobs",
    },
    {
      q: "Believe you can and you're halfway there.",
      a: "Theodore Roosevelt",
    },
    {
      q: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      a: "Winston Churchill",
    },
  ];

  // Ensure unique quotes
  const getUniqueQuotes = (fetchedQuotes: Quote[]): Quote[] => {
    const uniqueQuotes = Array.from(
      new Set(fetchedQuotes.map((quote) => quote.q))
    ).map((q) => fetchedQuotes.find((quote) => quote.q === q)!);

    return uniqueQuotes.slice(0, 3);
  };

  // Fetch quotes from the API
  const fetchQuotes = async () => {
    if (!isConnected) {
      setError("You are offline. Please check your internet connection.");
      setQuotes(FALLBACK_QUOTES);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let quotesArray: Quote[] = [];
      let attemptCount = 0;
      const MAX_ATTEMPTS = 5;

      // If `quoteType` is "random," fetch multiple times to get unique quotes
      if (quoteType === "random") {
        const uniqueQuoteSet = new Set<string>();

        while (
          quotesArray.length < 3 &&
          uniqueQuoteSet.size < 3 &&
          attemptCount < MAX_ATTEMPTS
        ) {
          attemptCount++;

          try {
            const response = await fetch(`https://zenquotes.io/api/random`, {
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                Expires: "0",
              },
            });

            if (!response.ok) {
              if (response.status === 429) {
                throw new Error("Rate limit exceeded. Please try again later.");
              }
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              const quote = data[0];

              // Ensure quote is unique
              if (!uniqueQuoteSet.has(quote.q)) {
                quotesArray.push(quote);
                uniqueQuoteSet.add(quote.q);
              }
            }
          } catch (fetchError) {
            console.error(`Attempt ${attemptCount} failed:`, fetchError);

            if (attemptCount >= MAX_ATTEMPTS) {
              throw new Error(
                "Failed to fetch random quotes after multiple attempts."
              );
            }

            // Delay to avoid API rate limiting
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      } else {
        // If `quoteType` is "today," fetch once
        const response = await fetch(`https://zenquotes.io/api/${quoteType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        quotesArray = Array.isArray(data) ? data.slice(0, 3) : [data];
      }

      const finalQuotes = getUniqueQuotes(quotesArray);
      setQuotes(finalQuotes.length > 0 ? finalQuotes : FALLBACK_QUOTES);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch quotes."
      );
      setQuotes(FALLBACK_QUOTES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    fetchQuotes();

    return () => unsubscribe();
  }, [quoteType]);

  const toggleQuoteType = () => {
    setQuoteType((prevType) => (prevType === "today" ? "random" : "today"));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchQuotes().then(() => setRefreshing(false));
  }, []);

  // Render error or offline state
  const renderErrorState = () => (
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
        {error || "An unexpected error occurred."}
      </Text>
      <TouchableOpacity
        onPress={fetchQuotes}
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

  const renderOfflineState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <WifiOff size={64} color="#9CA3AF" />
      <Text
        style={{
          color: "#1F2937",
          fontSize: 18,
          textAlign: "center",
          marginTop: 16,
        }}
      >
        You are offline. Please check your connection.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#BFDBFE" }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}>
            Quotes
          </Text>
          <TouchableOpacity
            onPress={toggleQuoteType}
            style={{ flexDirection: "row", alignItems: "center" }}
            disabled={loading || !isConnected}
          >
            <Text style={{ marginRight: 8, color: "#2563EB" }}>
              {quoteType === "today" ? "Today" : "Random"}
            </Text>
            <RefreshCw size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#4B5563" />
        ) : !isConnected ? (
          renderOfflineState()
        ) : error ? (
          renderErrorState()
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {quotes.map((quote) => (
              <View
                key={quote.q}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Image
                    source={{
                      uri: `https://api.dicebear.com/6.x/initials/png?seed=${
                        quote.a || "Unknown"
                      }`,
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 12,
                    }}
                  />
                  <Text style={{ fontSize: 14, color: "#4B5563" }}>
                    {quote.a || "Unknown"}
                  </Text>
                </View>
                <Text style={{ color: "#1F2937", marginBottom: 16 }}>
                  {quote.q}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#EFF6FF",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                    }}
                  >
                    <Heart size={16} color="#2563EB" />
                    <Text style={{ marginLeft: 8, color: "#2563EB" }}>
                      Like
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#EFF6FF",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                    }}
                  >
                    <MessageCircle size={16} color="#2563EB" />
                    <Text style={{ marginLeft: 8, color: "#2563EB" }}>
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
