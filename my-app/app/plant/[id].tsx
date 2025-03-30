import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlantDetail() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <ScrollView className="flex-1">
        <View className="relative h-80">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=60' }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          <View className="absolute bottom-0 left-0 right-0 p-6">
            <Text className="text-white text-3xl font-bold">Plant Name</Text>
            <Text className="text-white/80 text-lg">Plant Type</Text>
          </View>
        </View>

        <View className="p-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-[#2B5329]">Plant Details</Text>
              <Text className="text-gray-600">All about your plant</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center">
              <Ionicons name="heart-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="water" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Watering Schedule</Text>
                <Text className="text-gray-600">Every 3 days</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="leaf" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Health Status</Text>
                <Text className="text-gray-600">Healthy</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="location" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Location</Text>
                <Text className="text-gray-600">Indoor</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 