import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';

interface HeroSectionProps {
  onScanPress?: () => void;
}

const { width } = Dimensions.get('window');

const HeroSection: React.FC<HeroSectionProps> = ({
  onScanPress
}) => {
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  return (
    <View className="relative h-48 rounded-[40px] overflow-hidden">
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      
      {/* Animated Background Pattern */}
      <View className="absolute inset-0 opacity-10">
        <View className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20" />
        <View className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20" />
      </View>

      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold mb-2">Hello, Plant Lover! 🌿</Text>
            <Text className="text-white/90 text-base">Let's check your plants</Text>
          </View>
          
          <Animated.View 
            style={pulseStyle}
            className="ml-4"
          >
            <TouchableOpacity
              onPress={onScanPress}
              className="bg-white rounded-full w-14 h-14 items-center justify-center shadow-lg"
            >
              <Ionicons name="scan-outline" size={28} color="#4CAF50" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View className="mt-6 flex-row justify-between">
          <Link href="/plants" asChild>
            <TouchableOpacity className="w-[48%] bg-white/10 backdrop-blur-md rounded-2xl p-4 active:bg-white/20">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                  <Ionicons name="leaf" size={20} color="white" />
                </View>
                <View>
                  <Text className="text-white text-xl font-semibold">12 Plants</Text>
                  <Text className="text-white/70 text-sm">In your care</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/watering" asChild>
            <TouchableOpacity className="w-[48%] bg-white/10 backdrop-blur-md rounded-2xl p-4 active:bg-white/20">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                  <Ionicons name="water" size={20} color="white" />
                </View>
                <View>
                  <Text className="text-white text-xl font-semibold">3 Plants</Text>
                  <Text className="text-white/70 text-sm">Need watering</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default HeroSection; 