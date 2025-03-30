import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';

interface PlantCardProps {
  image: string;
  name: string;
  onPress: () => void;
}

const PlantCard = React.forwardRef<any, PlantCardProps>(({ image, name, onPress }, ref) => {
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(0, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View 
      ref={ref}
      style={[
        cardStyle,
        {
          width: 280,
          height: 360,
          borderRadius: 24,
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      ]}
    >
      <TouchableOpacity 
        onPress={onPress}
        className="flex-1"
      >
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          className="absolute inset-0"
        />

        {/* Plant Status Badge */}
        <View className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
          <Text className="text-white font-medium">Healthy</Text>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity 
          className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full items-center justify-center"
          onPress={() => {}}
        >
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>

        {/* Plant Info */}
        <View className="absolute bottom-0 left-0 right-0 p-6">
          <Text className="text-white text-2xl font-bold mb-2">{name}</Text>
          
          {/* Plant Details */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md items-center justify-center mr-2">
                <Ionicons name="leaf" size={16} color="white" />
              </View>
              <Text className="text-white/90">Indoor Plant</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md items-center justify-center mr-2">
                <Ionicons name="water" size={16} color="white" />
              </View>
              <Text className="text-white/90">Daily</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            className="mt-4 bg-white rounded-xl py-3 flex-row items-center justify-center"
            onPress={onPress}
          >
            <Ionicons name="chevron-forward" size={20} color="#2B5329" />
            <Text className="text-[#2B5329] font-semibold ml-2">View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default PlantCard; 