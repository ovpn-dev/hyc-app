import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { images } from "../../constants";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { InfoBox, CustomButton } from "../../components";
import LikedQuotesSection from "../../components/LikedQuotesSection";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Function to scale font sizes based on screen width
const scaleFont = (size) => {
  const baseWidth = 375; // Reference width (e.g., iPhone 8)
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

// Function to scale spacing/dimensions
const scaleSize = (size) => {
  const baseWidth = 375;
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

const Profile = () => {
  const { user, saveNickname, likedQuotes, removeLikedQuote } =
    useGlobalContext();
  const [showLikedQuotes, setShowLikedQuotes] = useState(true);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(user?.username || "");
  const [error, setError] = useState("");

  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) {
      setError("Nickname cannot be empty");
      return;
    }

    const success = await saveNickname(newNickname);

    if (success) {
      // Exit editing mode
      setIsEditingNickname(false);
      setError("");

      // Show success message
      Alert.alert("Success", "Your nickname has been updated!");
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ImageBackground
        source={images.friendship}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.1 }}
      >
        <KeyboardAwareScrollView>
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <View
              style={{
                width: scaleSize(64),
                height: scaleSize(64),
              }}
              className="border border-secondary rounded-lg flex justify-center items-center"
            >
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            {isEditingNickname ? (
              <View className="mt-5 w-full max-w-xs">
                <TextInput
                  className="bg-gray-800 text-white font-bold rounded-lg px-4 py-3 mb-2 text-center"
                  value={newNickname}
                  onChangeText={(text) => {
                    setNewNickname(text);
                    if (error) setError("");
                  }}
                  placeholder="Enter new nickname"
                  placeholderTextColor="#666"
                  maxLength={20}
                  style={{ fontSize: scaleFont(16) }}
                />
                {error ? (
                  <Text
                    className="text-red-500 mb-2 text-center"
                    style={{ fontSize: scaleFont(14) }}
                  >
                    {error}
                  </Text>
                ) : null}
                <View className="flex-row justify-center space-x-3 mt-2">
                  <CustomButton
                    title="Save"
                    handlePress={handleUpdateNickname}
                    containerStyles="px-5"
                    textStyles={{ fontSize: scaleFont(18) }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditingNickname(false);
                      setNewNickname(user?.username || "");
                      setError("");
                    }}
                    className="bg-gray-700 rounded-xl min-h-[62px] flex flex-row justify-center items-center py-3 px-5"
                  >
                    <Text
                      className="text-primary font-psemibold"
                      style={{ fontSize: scaleFont(18) }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <InfoBox
                  title={user?.username || "Guest User"}
                  containerStyles="mt-5"
                  // titleStyles={{
                  //   fontSize: scaleFont(18),
                  // }}
                />
                <TouchableOpacity
                  onPress={() => setIsEditingNickname(true)}
                  className="mt-2 py-2"
                >
                  <Text
                    className="text-[#325b73]"
                    style={{ fontSize: scaleFont(12) }}
                  >
                    Edit Nickname
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View className="w-full flex items-center mt-4">
              {/* Toggle for liked quotes section */}
              <TouchableOpacity
                onPress={() => setShowLikedQuotes(!showLikedQuotes)}
                className="mt-4 py-3 px-6"
              >
                <Text
                  className="text-[#325b73] font-semibold"
                  style={{ fontSize: scaleFont(14) }}
                >
                  {showLikedQuotes ? "Hide Liked Quotes" : "Show Liked Quotes"}
                </Text>
              </TouchableOpacity>

              {/* Liked Quotes Section */}
              {showLikedQuotes && (
                <View className="w-full">
                  <LikedQuotesSection
                    likedQuotes={likedQuotes}
                    onRemoveQuote={removeLikedQuote}
                  />
                </View>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Profile;
