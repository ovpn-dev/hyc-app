import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { images } from "../constants";
import { CustomButton, FormField } from "../components";
import { resetPassword } from "../lib/appwrite";

const ResetPassword = () => {
  const { userId, secret } = useLocalSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!userId || !secret) {
      Alert.alert(
        "Invalid Link",
        "The password reset link is invalid or has expired.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/sign-in"),
          },
        ]
      );
    }
  }, [userId, secret]);

  const submit = async () => {
    if (form.newPassword === "" || form.confirmPassword === "") {
      return Alert.alert("Error", "Please fill in all fields");
    }

    if (form.newPassword !== form.confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    if (form.newPassword.length < 8) {
      return Alert.alert("Error", "Password must be at least 8 characters");
    }

    setSubmitting(true);
    try {
      await resetPassword(
        userId,
        secret,
        form.newPassword,
        form.confirmPassword
      );

      Alert.alert(
        "Success",
        "Your password has been reset successfully. Please sign in with your new password.",
        [
          {
            text: "Sign In",
            onPress: () => router.replace("/(auth)/sign-in"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to reset password. The link may have expired. Please request a new password reset link."
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
            Reset Password
          </Text>
          <Text className="text-white-100 mt-2 font-pregular">
            Create a new password for your account
          </Text>

          <FormField
            title="New Password"
            value={form.newPassword}
            handleChangeText={(text) => setForm({ ...form, newPassword: text })}
            otherStyles="mt-7"
            secureTextEntry
          />

          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(text) =>
              setForm({ ...form, confirmPassword: text })
            }
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton
            title="Reset Password"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
