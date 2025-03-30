import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function FarmDetail() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <ScrollView className="flex-1">
        <View className="relative h-64">
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            className="absolute inset-0"
          />
          <View className="absolute inset-0 p-6">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-white text-3xl font-bold">Farm Name</Text>
                <Text className="text-white/80 text-lg">Location</Text>
              </View>
              <TouchableOpacity className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="settings-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="p-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-[#2B5329]">Farm Overview</Text>
              <Text className="text-gray-600">Manage your growing space</Text>
            </View>
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="leaf" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Total Plants</Text>
                <Text className="text-gray-600">12 plants</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="water" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Watering Status</Text>
                <Text className="text-gray-600">3 plants need water</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="thermometer" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Temperature</Text>
                <Text className="text-gray-600">24°C - Optimal</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 