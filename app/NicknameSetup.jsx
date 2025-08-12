import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CustomButton } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import { StatusBar } from "expo-status-bar";
import { images } from "../constants";

const NicknameSetup = ({ onComplete }) => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const { saveNickname, loading, setLoading } = useGlobalContext();

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    setLoading(true);
    const success = await saveNickname(nickname);
    setLoading(false);

    if (success) {
      // Complete the setup
      if (onComplete) {
        onComplete();
      } else {
        router.push("/home");
      }
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex justify-center items-center h-full px-5">
        <Image
          source={images.logoSmall}
          className="w-[100px] h-[120px]"
          resizeMode="contain"
        />

        <Text className="text-2xl text-white font-bold text-center my-6">
          What should we call you?
        </Text>

        <Text className="text-sm font-pregular text-gray-500 mb-6 text-center">
          Choose a nickname that will be used throughout the app.
        </Text>

        <View className="w-full">
          <TextInput
            className="bg-gray-800 text-white rounded-lg px-4 py-3 mb-2 w-full"
            placeholder="Enter your nickname"
            placeholderTextColor="#666"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              if (error) setError("");
            }}
            maxLength={20}
          />
          {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
        </View>

        <CustomButton
          title="Continue"
          handlePress={handleSaveNickname}
          containerStyles="w-full mt-6"
        />
      </View>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default NicknameSetup;
