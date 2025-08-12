import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Heart, Share as ShareIcon } from "lucide-react-native";
import { Share } from "react-native";
import { LikedQuote } from "../hooks/useLikedQuotes";
import { icons } from "../constants";

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

// Function to scale spacing/dimensions
const scaleSize = (size) => {
  const baseWidth = 375;
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

interface LikedQuotesSectionProps {
  likedQuotes: LikedQuote[];
  onRemoveQuote: (quoteText: string) => void;
}

const LikedQuotesSection: React.FC<LikedQuotesSectionProps> = ({
  likedQuotes,
  onRemoveQuote,
}) => {
  const handleShare = async (quote: LikedQuote) => {
    try {
      await Share.share({
        message: `"${quote.quoteText}" - ${quote.author}`,
      });
    } catch (error) {
      console.error("Error sharing quote:", error);
    }
  };

  // Format date to show just the date part
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Generate avatar URL using author name
  const getAvatarUrl = (author: string) => {
    return `https://api.dicebear.com/6.x/initials/png?seed=${
      author || "Unknown"
    }`;
  };

  const renderQuoteItem = ({ item }: { item: LikedQuote }) => (
    <View className="flex flex-col p-4 bg-secondary mb-4 rounded-lg border border-secondary">
      <View className="flex flex-row gap-3 justify-center items-center">
        <View
          style={{
            width: scaleSize(40),
            height: scaleSize(40),
          }}
          className="rounded-full overflow-hidden"
        >
          <Image
            source={{ uri: getAvatarUrl(item.author) }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <Text
            style={{ fontSize: scaleFont(14), lineHeight: scaleFont(20) }}
            className="text-white font-semibold"
          >
            "{item.quoteText}"
          </Text>
          <Text
            style={{ fontSize: scaleFont(13) }}
            className="text-gray-800 mt-1"
          >
            - {item.author}
          </Text>
          <Text
            style={{ fontSize: scaleFont(10) }}
            className="text-gray-500 mt-1"
          >
            Liked on {formatDate(item.likedAt)}
          </Text>
          <View className="flex-row justify-between mt-3">
            <TouchableOpacity
              onPress={() => onRemoveQuote(item.quoteText)}
              className="flex-row items-center"
            >
              <Heart size={scaleIcon(16)} color="#FF6B6B" fill="#FF6B6B" />
              <Text
                style={{ fontSize: scaleFont(12) }}
                className="text-white ml-2"
              >
                Unlike
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare(item)}
              className="flex-row items-center"
            >
              <ShareIcon size={scaleIcon(16)} color="#FFFFFF" />
              <Text
                style={{ fontSize: scaleFont(12) }}
                className="text-white ml-2"
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (likedQuotes.length === 0) {
    return (
      <View className="mt-8 p-4 bg-[#1E1E1E] rounded-lg flex items-center justify-center">
        <Text
          style={{ fontSize: scaleFont(14) }}
          className="text-white text-center"
        >
          You haven't liked any quotes yet.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-8">
      <Text
        style={{ fontSize: scaleFont(18) }}
        className="text-white font-semibold mb-4"
      >
        Liked Quotes
      </Text>
      <FlatList
        data={likedQuotes}
        renderItem={renderQuoteItem}
        keyExtractor={(item) => item.quoteText}
        scrollEnabled={false} // Prevent nested scrolling issues
      />
    </View>
  );
};

export default LikedQuotesSection;
