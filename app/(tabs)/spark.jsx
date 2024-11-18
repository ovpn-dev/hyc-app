import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MessageCircle,
  Search,
  Heart,
  User,
  RefreshCw,
} from "lucide-react-native";

export default function QuotesScreen() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quoteType, setQuoteType] = useState("today");

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      let quotesArray = [];

      // If `quoteType` is "random," fetch multiple times to get unique quotes
      if (quoteType === "random") {
        for (let i = 0; i < 3; i++) {
          const response = await fetch(`https://zenquotes.io/api/random`);
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            quotesArray.push(data[0]); // Only push the first quote from each response
          }
        }
      } else {
        // If `quoteType` is "today," fetch once
        const response = await fetch(`https://zenquotes.io/api/${quoteType}`);
        const data = await response.json();

        // Use the first three quotes if multiple are returned
        quotesArray = Array.isArray(data) ? data.slice(0, 3) : [data];
      }

      setQuotes(quotesArray);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [quoteType]);

  const toggleQuoteType = () => {
    setQuoteType((prevType) => (prevType === "today" ? "random" : "today"));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchQuotes().then(() => setRefreshing(false));
  }, []);

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
          >
            <Text style={{ marginRight: 8, color: "#2563EB" }}>
              {quoteType === "today" ? "Today" : "Random"}
            </Text>
            <RefreshCw size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#4B5563" />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {quotes.map((quote, index) => (
              <View
                key={index}
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
                      uri: `https://api.dicebear.com/6.x/initials/png?seed=${quote.a}`,
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 12,
                    }}
                  />
                  <Text style={{ fontSize: 14, color: "#4B5563" }}>
                    {quote.a}
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
                  <TouchableOpacity>
                    <Heart color="#9CA3AF" size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MessageCircle color="#9CA3AF" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 8,
          backgroundColor: "#FFFFFF",
        }}
      >
        <TouchableOpacity>
          <MessageCircle color="#9CA3AF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Search color="#9CA3AF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Heart color="#9CA3AF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <User color="#9CA3AF" size={24} />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}
