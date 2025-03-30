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
  },
  {
    id: '4',
    name: 'Monstera',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=60',
    type: 'Indoor',
    watering: 'Weekly',
    health: 'Healthy',
    isFavorite: true
  },
  {
    id: '5',
    name: 'Snake Plant',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=800&auto=format&fit=crop&q=60',
    type: 'Indoor',
    watering: 'Bi-weekly',
    health: 'Excellent',
    isFavorite: false
  }
];

export default function PlantsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{
          title: 'My Plants',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      <PlantList
        plants={plants}
        title="My Plant Collection"
        subtitle="All your plants in one place"
      />
    </SafeAreaView>
  );
} 