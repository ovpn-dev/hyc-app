import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";

export default function StepFour() {
  return (
    <View className="bg-primary mb-40">
      <Image
        source={images.logo}
        resizeMode="contain"
        className="w-[130px] h-[180px] self-center"
      />
      <Text className="text-2xl font-bold text-center mt-10">
        Top three random quotes for the day!
      </Text>
      {/* <Text className="text-lg font-bold text-center mt-10">
        Let's get started.
      </Text>
      <Text className="text-lg text-center mt-4">
        Your cutting edge, personal mental health companion
      </Text> */}
    </View>
  );
}