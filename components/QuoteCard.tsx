import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Dimensions,
} from "react-native";
import { Heart, Share as ShareIcon } from "lucide-react-native";
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

interface QuoteCardProps {
  quoteText: string;
  author: string;
  onLike?: () => void;
  isLiked?: boolean;
  onMenuPress?: () => void;
  maxLines?: number;
}

const QuoteCard = memo(
  ({
    quoteText,
    author,
    onLike,
    isLiked = false,
    onMenuPress,
    maxLines = 5,
  }: QuoteCardProps) => {
    const handleShare = async () => {
      try {
        await Share.share({
          message: `"${quoteText}" - ${author}`,
        });
      } catch (error) {
        console.error("Error sharing quote:", error);
      }
    };

    // Generate avatar URL using author name
    const avatarUrl = `https://api.dicebear.com/6.x/initials/png?seed=${
      author || "Unknown"
    }`;

    return (
      <View className="flex flex-col items-center p-4 bg-secondary mb-14 rounded-2xl shadow-2xl">
        <View className="flex flex-row gap-3 items-start">
          {/* Avatar Section */}
          <View className="flex justify-center items-center flex-row flex-1">
            <View
              style={{
                width: scaleSize(46),
                height: scaleSize(46),
              }}
              className="rounded-lg border border-secondary flex justify-center items-center p-0.5"
            >
              <Image
                source={{ uri: avatarUrl }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
                accessibilityRole="image"
                accessibilityLabel={`${author}'s avatar`}
              />
            </View>

            {/* Quote and Author Section */}
            <View className="flex justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="font-psemibold text-white"
                numberOfLines={maxLines}
                ellipsizeMode="tail"
                style={{
                  fontSize: scaleFont(16),
                  lineHeight: scaleFont(28),
                }}
                accessibilityRole="text"
              >
                "{quoteText}"
              </Text>
              <Text
                className="text-black font-pregular mt-2"
                numberOfLines={1}
                style={{ fontSize: scaleFont(12) }}
              >
                - {author}
              </Text>

              {/* Action Buttons */}
              <View className="flex-row gap-4 mt-3">
                <TouchableOpacity
                  onPress={onLike}
                  className="flex-row items-center"
                  accessibilityRole="button"
                  accessibilityLabel={isLiked ? "Unlike quote" : "Like quote"}
                >
                  <Heart
                    size={scaleIcon(16)}
                    color={isLiked ? "#FF6B6B" : "#000000"}
                    fill={isLiked ? "#FF6B6B" : "none"}
                  />
                  <Text
                    className="text-black ml-2"
                    style={{ fontSize: scaleFont(12) }}
                  >
                    {isLiked ? "Liked" : "Like"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  className="flex-row items-center"
                  accessibilityRole="button"
                  accessibilityLabel="Share quote"
                >
                  <ShareIcon size={scaleIcon(16)} color="#000000" />
                  <Text
                    className="text-black ml-2"
                    style={{ fontSize: scaleFont(12) }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Menu Icon */}
          <TouchableOpacity
            className="pt-2"
            onPress={onMenuPress}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <Image
              source={icons.menu}
              style={{
                width: scaleSize(20),
                height: scaleSize(20),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default QuoteCard;
