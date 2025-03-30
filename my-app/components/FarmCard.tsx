import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';

interface FarmCardProps {
  name: string;
  plantCount: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const FarmCard = React.forwardRef<any, FarmCardProps>(({ name, plantCount, icon, color, onPress }, ref) => {
  // Generate lighter and darker shades of the color
  const lighterColor = `${color}15`;
  const darkerColor = color;

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(1, {
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
          ...Platform.select({
            ios: {
              shadowColor: color,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 3,
            },
          }),
        },
      ]}
    >
      <TouchableOpacity 
        onPress={onPress}
        className="overflow-hidden"
      >
        <LinearGradient
          colors={[lighterColor, `${color}30`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-0.5"
        >
          <View 
            className="bg-white rounded-xl"
          >
            <View className="p-4">
              <View className="flex-row items-center justify-between mb-3">
                <View 
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: lighterColor }}
                >
                  <Ionicons name={icon} size={20} color={darkerColor} />
                </View>
                <View 
                  className="w-7 h-7 rounded-full items-center justify-center"
                  style={{ backgroundColor: lighterColor }}
                >
                  <Ionicons name="chevron-forward" size={16} color={darkerColor} />
                </View>
              </View>
              
              <View>
                <Text 
                  className="text-base font-semibold mb-1" 
                  numberOfLines={1}
                  style={{ color: darkerColor }}
                >
                  {name}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="leaf-outline" size={14} color={darkerColor} />
                  <Text 
                    className="text-sm ml-1" 
                    style={{ color: darkerColor }}
                  >
                    {plantCount} plants
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default FarmCard;