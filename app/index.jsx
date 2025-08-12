import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import StepProgress from "../components/multiStep";
import { useEffect, useState } from "react";
import { initializeFirebase } from "../firebase/firebase-config";
import NicknameSetup from "../app/NicknameSetup";
import * as Notifications from "expo-notifications";

const Welcome = () => {
  const { loading, isNewUser, setIsNewUser } = useGlobalContext();
  const [showNicknameSetup, setShowNicknameSetup] = useState(false);

  useEffect(() => {
    initializeFirebase();

    // Auto-redirect existing users to home, but check for notification first
    if (!isNewUser && !loading) {
      const checkAndRedirect = async () => {
        try {
          const response =
            await Notifications.getLastNotificationResponseAsync();
          if (
            response?.notification.request.content.data?.screen === "Quotes"
          ) {
            console.log("App opened from notification, navigating to quotes");
            setTimeout(() => {
              router.replace("/quotes");
            }, 300);
          } else {
            // No notification, just redirect to home
            setTimeout(() => {
              router.replace("/home");
            }, 100);
          }
        } catch (error) {
          // If can't check notification, just redirect to home
          setTimeout(() => {
            router.replace("/home");
          }, 100);
        }
      };

      checkAndRedirect();
    }
  }, [isNewUser, loading]);

  // Handle completion of the StepProgress
  const handleStepProgressComplete = () => {
    setShowNicknameSetup(true);
  };

  // Handle completion of nickname setup
  const handleNicknameComplete = () => {
    setIsNewUser(false);
  };

  // Auto-redirect existing users to home (unless they came from a notification)
  useEffect(() => {
    if (!isNewUser && !loading) {
      // This is now handled in the main useEffect above
    }
  }, [isNewUser, loading]);

  // If it's a new user, show StepProgress first, then nickname setup
  if (isNewUser) {
    if (showNicknameSetup) {
      return <NicknameSetup onComplete={handleNicknameComplete} />;
    }

    return <StepProgress onComplete={handleStepProgressComplete} />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={loading} />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-5">
          <Image
            source={images.logoSmall}
            className="w-[120px] h-[150px] p-10"
            resizeMode="contain"
          />
          <Image
            source={images.heroCrop}
            className="max-w-[500px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Copey</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-500 mt-7 text-center">
            Empowering Voices, Inspiring Minds: Your Daily Dose of Motivation
            and Guidance with Copey.
          </Text>
          <CustomButton
            title="Get Started"
            handlePress={() => router.push("/home")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
