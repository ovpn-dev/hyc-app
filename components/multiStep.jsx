import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import StepOne from "../components/stepOne";
import StepTwo from "../components/stepTwo";
import StepThree from "../components/stepThree";
import StepFour from "../components/stepFour";
import StepFive from "../components/stepFive";
import { SafeAreaView } from "react-native-safe-area-context";

const StepProgress = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prevStep) => prevStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const renderStepIndicator = () => {
    const indicators = [];
    for (let i = 1; i <= totalSteps; i++) {
      indicators.push(
        <View key={i} className="flex-row items-center">
          <View
            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center 
              ${
                i <= step
                  ? "border-pink-500 bg-secondary"
                  : "border-gray-200 bg-white"
              }`}
          >
            <Text
              className={`font-bold text-base 
                ${i <= step ? "text-white" : "text-gray-200"}`}
            >
              {i}
            </Text>
          </View>
          {i < totalSteps && (
            <View
              className={`w-5 h-0.5 mx-2.5 
                ${i < step ? "bg-secondary" : "bg-gray-200"}`}
            />
          )}
        </View>
      );
    }
    return <View className="flex-row mb-5">{indicators}</View>;
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-primary pt-24">
      {renderStepIndicator()}

      <View className="flex-1 justify-center items-center">
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
        {step === 5 && <StepFive />}
      </View>

      <View className="flex-row mb-5">
        {step > 1 && (
          <TouchableOpacity
            onPress={handlePrevious}
            className="px-5 py-2.5 rounded-full bg-gray-200 mr-2.5"
          >
            <Text className="text-gray-500 font-bold">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          className="px-5 py-2.5 rounded-full border-pink-500 bg-secondary"
        >
          <Text className="text-white font-bold">
            {step < totalSteps ? "Next" : "Finish"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StepProgress;
