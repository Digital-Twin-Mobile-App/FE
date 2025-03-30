import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../../components/SearchBar';
import PlantCard from '../../components/PlantCard';
import FarmCard from '../../components/FarmCard';
import HeroSection from '../../components/HeroSection';
import { router } from 'expo-router';

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const recentPlants = [
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
  ];

  const farms = [
    { id: '1', name: 'Urban Garden', plantCount: 10, icon: 'grid-outline' as const, color: '#4CAF50' },
    { id: '2', name: 'Greenhouse', plantCount: 8, icon: 'home-outline' as const, color: '#2196F3' },
    { id: '3', name: 'Backyard', plantCount: 12, icon: 'leaf-outline' as const, color: '#FFC107' },
    { id: '4', name: 'Community', plantCount: 15, icon: 'people-outline' as const, color: '#E91E63' },
  ];

  const quickActions = [
    { id: '1', name: 'Add Plant', icon: 'add-circle-outline', color: '#4CAF50', onPress: () => router.push('/add-plant') },
    { id: '2', name: 'Analytics', icon: 'analytics-outline', color: '#2196F3', onPress: () => router.push('/analytics') },
    { id: '3', name: 'Schedule', icon: 'calendar-outline', color: '#FFC107', onPress: () => router.push('/schedule') },
    { id: '4', name: 'Settings', icon: 'settings-outline', color: '#9C27B0', onPress: () => router.push('/settings') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7F4]">
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7F4" />
      
      {/* Header */}
      <LinearGradient
        colors={['#F0F7F4', '#E8F5E9']}
        className="px-5 pt-4 pb-2"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-3 shadow-sm">
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150' }}
                className="w-full h-full rounded-full"
              />
            </View>
            <View>
              <Text className="text-sm text-gray-600">Welcome back</Text>
              <Text className="text-2xl font-bold text-[#2B5329]">Plant Care</Text>
            </View>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
              onPress={() => router.push('/notifications')}
            >
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              <Ionicons name="notifications" size={22} color="#2B5329" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Hero Section */}
        <View className="px-5 pt-2">
          <HeroSection 
            onScanPress={() => console.log('Scan pressed')}
          />
        </View>

        {/* Search Bar */}
        <View className="px-5 py-4">
          <SearchBar 
            value={searchText}
            onChangeText={setSearchText}
            onSubmit={() => console.log('Search submitted:', searchText)}
          />
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                className="w-[48%] rounded-2xl p-4 mb-4 overflow-hidden"
                onPress={action.onPress}
              >
                <LinearGradient
                  colors={[`${action.color}15`, `${action.color}30`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="absolute inset-0"
                />
                <View className="relative">
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                    style={{ backgroundColor: `${action.color}30` }}
                  >
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text className="text-[#2B5329] font-semibold">{action.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Plants */}
        <View className="mt-4">
          <View className="px-5 flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-xl font-semibold text-[#2B5329]">Recent Plants</Text>
              <Text className="text-sm text-gray-600">Your latest additions</Text>
            </View>
            <TouchableOpacity className="bg-[#4CAF50] rounded-full px-4 py-2">
              <Text className="text-white font-medium">View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="py-2"
          >
            {recentPlants.map((plant, index) => (
              <View 
                key={plant.id} 
                style={{ 
                  marginRight: index === recentPlants.length - 1 ? 0 : 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Link href={{ pathname: "/plant/[id]", params: { id: plant.id } }} asChild>
                  <PlantCard
                    image={plant.image}
                    name={plant.name}
                    onPress={() => {}}
                  />
                </Link>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Farms */}
        <View className="mt-6">
          <View className="px-5 flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-xl font-semibold text-[#2B5329]">Your Farms</Text>
              <Text className="text-sm text-gray-600">Manage your growing spaces</Text>
            </View>
            <TouchableOpacity className="bg-[#4CAF50] rounded-full px-4 py-2">
              <Text className="text-white font-medium">View all</Text>
            </TouchableOpacity>
          </View>

          <View className="px-5">
            <View className="flex-row flex-wrap -mx-2">
              {farms.map((farm) => (
                <View key={farm.id} className="w-1/2 px-2 mb-4">
                  <Link href={{ pathname: "/farm/[id]", params: { id: farm.id } }} asChild>
                    <FarmCard
                      name={farm.name}
                      plantCount={farm.plantCount}
                      icon={farm.icon}
                      color={farm.color}
                      onPress={() => {}}
                    />
                  </Link>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;