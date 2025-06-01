import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function PlantCareGuide() {
  const careTips = [
    {
      title: "Watering Basics",
      icon: "water-outline" as const,
      tips: [
        "Check soil moisture before watering",
        "Water deeply but less frequently",
        "Avoid overwatering - it's better to underwater than overwater",
        "Use room temperature water"
      ]
    },
    {
      title: "Light Requirements",
      icon: "sunny-outline" as const,
      tips: [
        "Most plants need bright, indirect light",
        "Avoid direct sunlight for most indoor plants",
        "Rotate plants regularly for even growth",
        "Watch for signs of too much or too little light"
      ]
    },
    {
      title: "Temperature & Humidity",
      icon: "thermometer-outline" as const,
      tips: [
        "Keep temperature between 65-75°F (18-24°C)",
        "Avoid drafts and sudden temperature changes",
        "Group plants to increase humidity",
        "Use a humidifier in dry conditions"
      ]
    },
    {
      title: "Soil & Fertilizer",
      icon: "leaf-outline" as const,
      tips: [
        "Use well-draining potting mix",
        "Repot when roots outgrow container",
        "Fertilize during growing season",
        "Use organic fertilizers when possible"
      ]
    }
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen 
          options={{
            title: "Plant Care Guide",
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        
        <ScrollView className="flex-1 p-4">
          {careTips.map((section, index) => (
            <View key={index} className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                  <Ionicons name={section.icon} size={24} color="#4CAF50" />
                </View>
                <Text className="text-xl font-bold text-gray-800">{section.title}</Text>
              </View>
              
              <View className="bg-gray-50 rounded-xl p-4">
                {section.tips.map((tip, tipIndex) => (
                  <View key={tipIndex} className="flex-row items-start mb-2">
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" className="mt-1" />
                    <Text className="text-gray-700 ml-2 flex-1">{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
} 