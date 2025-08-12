import { React, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Linking } from "react-native";
import { SOSModal } from "../../components/sosModal";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Function to scale font sizes based on screen width
const scaleFont = (size) => {
  const baseWidth = 375; // Reference width (e.g., iPhone 8)
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

export default function HomeScreen() {
  const [sosModalVisible, setSOSModalVisible] = useState(false);

  // Get dynamic window dimensions
  const { width, height } = useWindowDimensions();

  // Determine if in landscape mode
  const isLandscape = width > height;

  // Dynamic sizes
  const logoWidth = screenWidth * 0.3; // 30% of screen width for logos
  const cardSize = screenWidth / 2 - 20; // Two cards per row with margin

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar style="dark" />
      <ImageBackground
        source={images.heroHome} // Add your background image to constants
        style={{
          marginTop: 8,
          borderRadius: 16, // Optional: rounded corners
          overflow: "hidden", // Ensures the borderRadius is respected
        }}
        imageStyle={{
          opacity: 0.5, // Adjust opacity as needed
          resizeMode: "cover",
        }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header with Logos */}
          <View className="justify-between p-5 flex-row">
            <TouchableOpacity
              onPress={() => Linking.openURL("https://helpyouthcope.org/")}
            >
              <Image
                source={images.logo1}
                style={{ width: logoWidth, height: logoWidth * 0.75 }} // Maintain aspect ratio
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSOSModalVisible(true)}>
              <Image
                source={images.sos}
                style={{ width: logoWidth, height: logoWidth * 0.75 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <SOSModal
            visible={sosModalVisible}
            onClose={() => setSOSModalVisible(false)}
          />

          {/* Chat Section */}
          <View className="mt-5 mx-4 bg-[#325b73] rounded-lg p-4 flex-row justify-between items-center">
            <View className="flex-1">
              <Text
                style={{ fontSize: scaleFont(isLandscape ? 19 : 20) }}
                className="font-semibold text-white"
              >
                Talk To Copey
              </Text>
              <Text
                style={{
                  fontSize: scaleFont(isLandscape ? 13 : 14),
                  marginTop: 4,
                }}
                className="text-white"
              >
                Talk about anything with Copey!{"\n"}What's on your mind today?
              </Text>
              <TouchableOpacity
                className="mt-3 bg-secondary rounded-lg py-2 px-4"
                onPress={() => router.push("/chatscreen")}
                style={{ width: screenWidth * 0.3 }}
              >
                <Text
                  style={{ fontSize: scaleFont(isLandscape ? 14 : 16) }}
                  className="text-white font-bold"
                >
                  Start Chatting
                </Text>
              </TouchableOpacity>
            </View>
            <Image
              source={images.logo}
              style={{ width: screenWidth * 0.2, height: screenWidth * 0.2 }}
              resizeMode="contain"
            />
          </View>

          {/* Topics */}
          <View className="mt-10">
            <Text
              style={{ fontSize: scaleFont(24), marginLeft: 16 }}
              className="font-bold text-black"
            >
              Topics
            </Text>

            <View className="flex-row flex-wrap justify-around p-4">
              {/* Topic Card: Today's Quote */}
              <TouchableOpacity
                className="mb-4"
                onPress={() => router.push("/quotes")}
              >
                <View
                  className="bg-secondary rounded-lg p-4 items-center justify-center"
                  style={{ width: cardSize, height: cardSize }}
                >
                  <Image
                    source={images.quotes}
                    resizeMode="contain"
                    style={{ width: cardSize * 0.4, height: cardSize * 0.4 }}
                  />
                  <Text
                    style={{ fontSize: scaleFont(16), marginTop: 8 }}
                    className="text-white font-bold text-center"
                  >
                    Today's Quote
                  </Text>
                  <Text
                    style={{ fontSize: scaleFont(12), marginTop: 4 }}
                    className="text-gray-600 text-center"
                  >
                    A quote to start your day
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Topic Card: Resources */}
              <TouchableOpacity
                className="mb-4"
                onPress={() => router.push("/needhelp")}
              >
                <View
                  className="bg-secondary rounded-lg p-4 items-center justify-center"
                  style={{ width: cardSize, height: cardSize }}
                >
                  <Image
                    source={images.hr}
                    resizeMode="contain"
                    style={{ width: cardSize * 0.4, height: cardSize * 0.4 }}
                  />
                  <Text
                    style={{ fontSize: scaleFont(16), marginTop: 8 }}
                    className="text-white font-bold text-center"
                  >
                    Resources
                  </Text>
                  <Text
                    style={{ fontSize: scaleFont(12), marginTop: 4 }}
                    className="text-gray-600 text-center"
                  >
                    Helpful resources
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Topic Card: Blog */}
              <TouchableOpacity
                className="mb-4"
                onPress={() => router.push("/blog")}
              >
                <View
                  className="bg-secondary rounded-lg p-4 items-center justify-center"
                  style={{ width: cardSize, height: cardSize }}
                >
                  <Image
                    source={images.blog}
                    resizeMode="contain"
                    style={{ width: cardSize * 0.4, height: cardSize * 0.4 }}
                  />
                  <Text
                    style={{ fontSize: scaleFont(16), marginTop: 8 }}
                    className="text-white font-bold text-center"
                  >
                    Blog
                  </Text>
                  <Text
                    style={{ fontSize: scaleFont(12), marginTop: 4 }}
                    className="text-gray-600 text-center"
                  >
                    Recent blog articles
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Topic Card: Tips */}
              <TouchableOpacity
                className="mb-4"
                onPress={() => router.push("/tips")}
              >
                <View
                  className="bg-secondary rounded-lg p-4 items-center justify-center"
                  style={{ width: cardSize, height: cardSize }}
                >
                  <Image
                    source={images.tips}
                    resizeMode="contain"
                    style={{ width: cardSize * 0.4, height: cardSize * 0.4 }}
                  />
                  <Text
                    style={{ fontSize: scaleFont(16), marginTop: 8 }}
                    className="text-white font-bold text-center"
                  >
                    Tips
                  </Text>
                  <Text
                    style={{ fontSize: scaleFont(12), marginTop: 4 }}
                    className="text-gray-600 text-center"
                  >
                    Tips to navigate life
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
