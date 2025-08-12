import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";

export default function StepThree() {
  return (
    <View className="bg-primary mb-40">
      <Image
        source={images.pngwing}
        resizeMode="contain"
        className="w-[130px] h-[180px] self-center"
      />
      <Text className="text-2xl font-bold text-center mt-10">
        Get daily motivational quotes to keep you going!
      </Text>
      {/* <Text className="text-lg font-bold text-center mt-10">
        Let's get started.
      </Text>
      <Text className="text-lg text-center mt-4">
        Get daily motivational quotes to keep you going!
      </Text> */}
    </View>
  );
}
