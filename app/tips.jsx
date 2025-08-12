import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { icons, images } from "../constants";

// Function to scale font sizes based on screen width
const scaleFont = (size) => {
  const { width } = Dimensions.get("window");
  const baseWidth = 375; // Reference width (e.g., iPhone 8)
  const scale = width / baseWidth;
  return Math.round(size * scale);
};

// Tips data array with titles, descriptions, and URLs
const tipsData = [
  {
    id: 1,
    title: "Overcome Anxiety",
    description: "10 Strategies for You to Overcome Anxiety",
    url: "https://helpyouthcope.org/overcome-anxiety/",
    image: images.anxiety,
  },
  {
    id: 2,
    title: "Navigate Peer Pressure",
    description: "10 Tips for You to Navigate Peer Pressure",
    url: "https://helpyouthcope.org/navigate-peer-pressure/",
    image: images.peerPressure,
  },
  {
    id: 3,
    title: "Nurturing Friendships",
    description: "10 tips for building strong, lasting friendships",
    url: "https://helpyouthcope.org/10-tips-for-nurturing-friendships/",
    image: images.friendship,
  },
  {
    id: 4,
    title: "Essential guidance for teenage years",
    description: "10 Tips for Navigating Teenage Life",
    url: "https://helpyouthcope.org/10-tips-for-navigating-teenage-life/",
    image: images.teenLife,
  },
  {
    id: 5,
    title: "Eating Healthy",
    description: "10 Tips on Eating Healthy for Teenagers",
    url: "https://helpyouthcope.org/eating-healthy/",
    image: images.healthyEating,
  },
];

export default function TipsScreen() {
  // Get dynamic window dimensions
  const { width, height } = useWindowDimensions();

  // Determine if in landscape mode
  const isLandscape = width > height;

  // Calculate number of columns based on orientation and screen size
  const numColumns = isLandscape ? (width > 1024 ? 3 : 2) : 1;

  // Calculate card width based on number of columns
  const cardWidth = (width - 32 - (numColumns - 1) * 16) / numColumns;

  // Function to open external URLs
  const openURL = (url) => {
    Linking.openURL(url);
  };

  // Split tips into rows based on numColumns
  const getGridLayout = () => {
    let result = [];
    for (let i = 0; i < tipsData.length; i += numColumns) {
      result.push(tipsData.slice(i, i + numColumns));
    }
    return result;
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="p-5 flex-row items-center bg-[#161622]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          {/* <Image
            source={icons.leftArrow}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          /> */}
          <Text
            style={{ fontSize: scaleFont(14), marginRight: 16 }}
            className="text-white"
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={{ fontSize: scaleFont(isLandscape ? 10 : 18) }}
          className="text-blue-400"
        >
          Helpful Tips
        </Text>
      </View>

      {/* Main content with background image */}
      <ImageBackground
        source={images.tipsBackground}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        >
          <Text
            style={{
              fontSize: scaleFont(isLandscape ? 8 : 14),
              marginVertical: 12,
            }}
            className="text-gray-700"
          >
            Explore these resources to help navigate life's challenges
          </Text>

          {/* Responsive Grid Layout */}
          {getGridLayout().map((row, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              className="flex-row justify-between mb-4"
            >
              {row.map((tip) => (
                <TouchableOpacity
                  key={tip.id}
                  onPress={() => openURL(tip.url)}
                  style={{ width: cardWidth }}
                >
                  <View
                    className="bg-white rounded-lg overflow-hidden shadow-md"
                    style={{ height: isLandscape ? "auto" : "auto" }}
                  >
                    <Image
                      source={tip.image}
                      style={{
                        width: cardWidth,
                        height: isLandscape ? 140 : 160,
                      }}
                      resizeMode="cover"
                    />
                    <View className="p-4">
                      {/* <Text
                        style={{ fontSize: scaleFont(isLandscape ? 14 : 18) }}
                        className="font-bold text-black"
                      >
                        {tip.title}
                      </Text> */}
                      <Text
                        style={{
                          fontSize: scaleFont(isLandscape ? 9 : 14),
                          marginTop: 4,
                        }}
                        className="text-gray-600"
                      >
                        {tip.description}
                      </Text>
                      <View className="mt-3 flex-row items-center">
                        <Text
                          style={{ fontSize: scaleFont(isLandscape ? 8 : 12) }}
                          className="text-secondary font-semibold"
                        >
                          Learn More
                        </Text>
                        <Image
                          source={icons.rightArrow}
                          style={{ width: 14, height: 14, marginLeft: 5 }}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Add placeholder views to fill the last row if needed */}
              {row.length < numColumns &&
                Array(numColumns - row.length)
                  .fill()
                  .map((_, i) => (
                    <View key={`empty-${i}`} style={{ width: cardWidth }} />
                  ))}
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
