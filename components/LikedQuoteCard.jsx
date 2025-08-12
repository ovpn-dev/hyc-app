import React from "react";
import { View, Text, Image, TouchableOpacity, Share } from "react-native";
import { Heart, Share as ShareIcon } from "lucide-react-native";

const LikedQuoteCard = ({ quote, onUnlike }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${quote.quoteText}" - ${quote.author}`,
      });
    } catch (error) {
      console.error("Error sharing quote:", error);
    }
  };

  // Generate avatar URL using author name
  const avatarUrl = `https://api.dicebear.com/6.x/initials/png?seed=${encodeURIComponent(
    quote.author || "Unknown"
  )}`;

  return (
    <View className="flex flex-col items-center p-4 bg-secondary mb-6 rounded-2xl">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatarUrl }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
              accessibilityRole="image"
              accessibilityLabel={`${quote.author}'s avatar`}
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-base text-white"
              numberOfLines={3}
              style={{ lineHeight: 24 }}
            >
              "{quote.quoteText}"
            </Text>
            <Text className="text-xs text-gray-200 font-pregular mt-2">
              - {quote.author}
            </Text>

            <View className="flex-row gap-4 mt-3">
              <TouchableOpacity
                onPress={() => onUnlike(quote)}
                className="flex-row items-center"
                accessibilityRole="button"
                accessibilityLabel="Unlike quote"
              >
                <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />
                <Text className="text-gray-200 text-xs ml-2">Unlike</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                className="flex-row items-center"
                accessibilityRole="button"
                accessibilityLabel="Share quote"
              >
                <ShareIcon size={16} color="#E5E7EB" />
                <Text className="text-gray-200 text-xs ml-2">Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LikedQuoteCard;
