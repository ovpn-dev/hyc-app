import { View, Text, Dimensions } from "react-native";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Function to scale font sizes based on screen width
const scaleFont = (size) => {
  const baseWidth = 375; // Reference width (e.g., iPhone 8)
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text
        className={`text-[#325b73] text-center font-psemibold ${titleStyles}`}
        style={{ fontSize: scaleFont(12) }}
      >
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
