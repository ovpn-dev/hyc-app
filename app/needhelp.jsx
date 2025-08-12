import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Function to scale font sizes based on screen width
const scaleFont = (size) => {
  const baseWidth = 375; // Reference width (e.g., iPhone 8)
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

const NeedHelp = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <ScrollView accessibilityLabel="Content" className="p-4 bg-primary">
        <View className="flex-row items-center bg-[#161622] rounded-lg p-2 mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text
              style={{ fontSize: scaleFont(16) }}
              className="text-white mr-4"
            >
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: scaleFont(20) }} className="text-blue-400">
            Need Help?
          </Text>
        </View>

        <Text style={{ fontSize: scaleFont(14) }} className="mb-4">
          Feeling overwhelmed, stressed, or anxious? You're not alone. It's okay
          to ask for help when you need it. Whether you're struggling with
          school, relationships, or your mental health, there are resources
          available to support you. Below, we've compiled a list of
          organizations and hotlines where you can reach out for assistance.
        </Text>

        <Text
          style={{ fontSize: scaleFont(14), fontWeight: "bold" }}
          className="mb-4"
        >
          Remember, reaching out for help is a sign of strength, not weakness.
        </Text>

        <Image
          source={{
            uri: "https://helpyouthcope.org/wp-content/uploads/2024/05/pexels-omar-ramadan-1739260-7065319-1024x339.jpg",
          }}
          className="w-full h-48 my-5 object-cover"
          alt="boy with phone pondering to call"
        />

        <Text
          style={{ fontSize: scaleFont(18), fontWeight: "bold" }}
          className="mb-2"
        >
          National Crisis Hotlines:
        </Text>

        {renderResource(
          "National Suicide Prevention Lifeline",
          "1-800-273-TALK (1-800-273-8255)",
          "https://suicidepreventionlifeline.org/",
          "Confidential support for individuals in crisis, available 24/7, free and confidential."
        )}
        {renderResource(
          "988 Suicide & Crisis Lifeline",
          "988",
          "http://988lifeline.org",
          "The Lifeline provides 24/7, free and confidential support for people in distress."
        )}
        {renderResource(
          "Crisis Text Line",
          'Text "CONVO" to 741741',
          "https://www.crisistextline.org/",
          "Connect with a trained crisis counselor via text message, available 24/7."
        )}
        {renderResource(
          "The Trevor Project (LGBTQ+ Youth)",
          '1-866-488-7386, Text "START" to 678678',
          "https://www.thetrevorproject.org/",
          "Crisis intervention and suicide prevention services for LGBTQ+ youth, available 24/7."
        )}
        {renderResource(
          "RAINN (Rape, Abuse & Incest National Network)",
          "1-800-656-4673",
          "https://www.rainn.org/",
          "Free, confidential, 24/7 help is available. Call or visit online.rainn.org to chat with a support specialist."
        )}
        {renderResource(
          "Helping Survivors, a partner of RAINN",
          "Website: Helping Survivors",
          "https://helpingsurvivors.org/",
          "Free, confidential, 24/7 help is available. Call or visit online.rainn.org to chat with a support specialist."
        )}
        {renderResource(
          "Online Support Communities",
          "7 Cups",
          "https://www.7cups.com/",
          "Free online therapy and emotional support chat rooms, where you can connect with trained listeners for anonymous support."
        )}
        {renderResource(
          "Online Support Communities",
          "National Runaway Safeline",
          "https://www.1800runaway.org/",
          "Provides support and resources for runaway, homeless, and at-risk youth. Offers a 24/7 hotline, online chat, and email support."
        )}
        {renderResource(
          "Online Support Communities",
          "Teen Line",
          "https://teenlineonline.org/",
          "A confidential hotline and online chat service where teens can talk with other teens about their concerns. Available every evening from 6 PM to 10 PM PST."
        )}
        {renderResource(
          "Additional Resources",
          "Local Mental Health Services:",
          "-",
          "Reach out to local mental health clinics, community centers, or school counselors for support and resources available in your area."
        )}
        {renderResource(
          "School Counselors or Therapists",
          "If you're a student, your school counselor or therapist can provide confidential support and guidance."
        )}
        {renderResource(
          "Parents and/or family members",
          "Remember, sometimes the quickest and closest help is your own circle of family and friends. Talk to someone you trust, and they can further guide you in the right direction."
        )}

        <Text
          style={{ fontSize: scaleFont(14), fontWeight: "bold" }}
          className="mt-4"
        >
          Remember, it's okay to not be okay, and seeking help is an important
          step towards healing and recovery.
        </Text>
        <Text
          style={{ fontSize: scaleFont(14), fontWeight: "bold" }}
          className="text-secondary mb-5 mt-4"
        >
          You are valued, and there are people who care about you and want to
          help. Don't hesitate to reach out to any of the resources listed above
          whenever you need support. You're not alone in this journey.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderResource = (title, contact, link, description) => (
  <View className="my-2">
    <Text style={{ fontSize: scaleFont(14), fontWeight: "bold" }}>
      {title}:
    </Text>
    <Text style={{ fontSize: scaleFont(14) }}>{contact}</Text>
    {link && (
      <Text
        onPress={() => Linking.openURL(link)}
        style={{ fontSize: scaleFont(14) }}
        className="text-blue-500 underline"
      >
        {link}
      </Text>
    )}
    <Text style={{ fontSize: scaleFont(14) }}>{description}</Text>
  </View>
);

export default NeedHelp;
