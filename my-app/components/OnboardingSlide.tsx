import React from 'react';
import { View, Text, Image } from 'react-native';

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: any;
  backgroundColor: string; // Tailwind bg class, e.g. 'bg-green-500'
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ title, description, image, backgroundColor }) => {
  return (
    <View className={`flex-1 items-center justify-center px-6 ${backgroundColor}`}>      
      <View className="bg-white/20 rounded-full w-64 h-64 mb-8 items-center justify-center">
        <Image source={image} className="w-56 h-56" resizeMode="contain" />
      </View>
      <Text className="text-3xl font-extrabold text-white text-center mb-4">
        {title}
      </Text>
      <Text className="text-base text-white/80 text-center leading-6">
        {description}
      </Text>
    </View>
  );
};

export default OnboardingSlide;
