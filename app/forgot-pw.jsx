import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { images } from "../constants";
import { CustomButton, FormField } from "../components";
import { forgotPassword } from "../lib/appwrite";

const ForgotPassword = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const submit = async () => {
    if (email === "") {
      return Alert.alert("Error", "Please enter your email");
    }

    setSubmitting(true);
    try {
      await forgotPassword(email);
      Alert.alert(
        "Email Sent",
        "If an account exists with this email, you will receive password reset instructions.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      // For security reasons, don't tell users if the email exists or not
      Alert.alert(
        "Email Sent",
        "If an account exists with this email, you will receive password reset instructions."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Forgot Password
          </Text>
          <Text className="text-white-100 mt-2 font-pregular">
            Enter your email and we'll send you instructions to reset your
            password
          </Text>

          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <CustomButton
            title="Send Reset Instructions"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white-100 font-pregular">
              Remember your password?
            </Text>
            <Link
              href="/(auth)/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
