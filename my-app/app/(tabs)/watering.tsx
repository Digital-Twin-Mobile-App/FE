import React from 'react';
import { SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import PlantList from '../../components/PlantList';

const plants = [
  {
    id: '1',
    name: 'Japanese Maple',
    image: 'https://images.unsplash.com/photo-1605197384465-714d4c360f31?w=800&auto=format&fit=crop&q=60',
    type: 'Outdoor',
    watering: 'Weekly',
    health: 'Healthy',
    isFavorite: false
  },
  {
    id: '2',
    name: 'Live Oak',
    image: 'https://images.unsplash.com/photo-1542382841912-85c1489c6a14?w=800&auto=format&fit=crop&q=60',
    type: 'Outdoor',
    watering: 'Bi-weekly',
    health: 'Good',
    isFavorite: true
  },
  {
    id: '3',
    name: 'Bonsai',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=60',
    type: 'Indoor',
    watering: 'Daily',
    health: 'Excellent',
    isFavorite: false
  }
];

export default function WateringScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{
          title: 'Watering Schedule',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      <PlantList
        plants={plants}
        title="Watering Schedule"
        subtitle="Plants that need water today"
        showWateringStatus={true}
        hideAddButton={true}
      />
    </SafeAreaView>
  );
} 