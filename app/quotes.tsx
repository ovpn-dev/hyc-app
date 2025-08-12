import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshCw, WifiOff } from "lucide-react-native";
import QuoteCard from "../components/QuoteCard";
import { useQuotes } from "./hooks/useQuotes";
import { useNetwork } from "./hooks/useNetwork";
import { NotificationSettings } from "../components/NotificationSettings";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../context/GlobalProvider";
import { images } from "../constants";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Function to scale font sizes based on screen width
const scaleFont = (size) => {
  const baseWidth = 375; // Reference width (e.g., iPhone 8)
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

// Function to scale icon sizes
const scaleIcon = (size) => {
  const baseWidth = 375;
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

export default function QuotesScreen() {
  const [quoteType, setQuoteType] = useState<"today" | "random">("today");
  const isConnected = useNetwork();
  const { quotes, loading, error, refreshing, onRefresh, refetch } =
    useQuotes(quoteType);
  const navigation = useNavigation();

  // Use global context for liked quotes
  const { isQuoteLiked, addLikedQuote, removeLikedQuote } = useGlobalContext();

  const toggleQuoteType = () => {
    setQuoteType((prevType) => (prevType === "today" ? "random" : "today"));
  };

  const handleLike = useCallback(
    (quote: any) => {
      const { q: quoteText, a: author } = quote;

      if (isQuoteLiked(quoteText)) {
        removeLikedQuote(quoteText);
      } else {
        addLikedQuote(quoteText, author);
      }
    },
    [isQuoteLiked, addLikedQuote, removeLikedQuote]
  );

  const handleMenuPress = useCallback((quote: any) => {
    console.log("Menu pressed for quote:", quote);
  }, []);

  if (!isConnected) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <WifiOff size={scaleIcon(64)} color="#9CA3AF" />
        <Text
          style={{ fontSize: scaleFont(18), marginTop: 16 }}
          className="text-gray-800 text-center"
        >
          You are offline. Please check your connection.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ImageBackground
        source={images.tipsBackground} // Add a background image to your constants
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.3 }}
      >
        <View className="flex-1 px-4 pt-4">
          <NotificationSettings />
          <View className="flex-row justify-between bg-[#161622] rounded-lg p-2 items-center mb-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text
                style={{ fontSize: scaleFont(13), marginRight: 16 }}
                className="text-white"
              >
                ← Back
              </Text>
            </TouchableOpacity>
            <Text
              style={{ fontSize: scaleFont(18), flex: 1 }}
              className="text-blue-400"
            >
              Quotes
            </Text>
            <TouchableOpacity
              onPress={toggleQuoteType}
              className="flex-row items-center"
              disabled={loading || !isConnected}
            >
              <Text
                style={{ fontSize: scaleFont(13), marginRight: 8 }}
                className="text-white"
              >
                {quoteType === "today" ? "More Quotes" : "Today's Quote"}
              </Text>
              <RefreshCw size={scaleIcon(14)} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4B5563" />
          ) : error ? (
            <View className="flex-1 justify-center items-center p-4">
              <Text
                style={{ fontSize: scaleFont(16) }}
                className="text-red-500 text-center"
              >
                {error}
              </Text>
              <TouchableOpacity
                onPress={refetch}
                className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
              >
                <Text
                  style={{ fontSize: scaleFont(16) }}
                  className="text-white"
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {quotes.map((quote: any) => (
                <QuoteCard
                  key={quote.q}
                  quoteText={quote.q}
                  author={quote.a}
                  onLike={() => handleLike(quote)}
                  isLiked={isQuoteLiked(quote.q)}
                  onMenuPress={() => handleMenuPress(quote)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
