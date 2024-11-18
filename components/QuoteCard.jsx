import { View, Text, Image } from "react-native";
import { icons } from "../constants";

const QuoteCard = ({ quoteText, author, avatar }) => {
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        {/* Avatar Section */}
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* Quote and Author Section */}
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-base text-white"
              numberOfLines={3}
              style={{ lineHeight: 22 }}
            >
              "{quoteText}"
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular mt-2"
              numberOfLines={1}
            >
              - {author}
            </Text>
          </View>
        </View>

        {/* Optional Menu Icon */}
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
    </View>
  );
};

export default QuoteCard;
