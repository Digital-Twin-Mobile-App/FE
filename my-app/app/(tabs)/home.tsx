import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../../components/SearchBar';
import PlantCard from '../../components/PlantCard';
import FarmCard from '../../components/FarmCard';
import HeroSection from '../../components/HeroSection';
import { router } from 'expo-router';
import { getUserInfo } from '../../services/user';
import { getUnreadCount } from '../../services/notification';
import PlantList from '../../components/PlantList';
import { getPlants } from '../../services/plant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRefresh } from '../../context/RefreshContext';

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: 'https://i.pravatar.cc/300',
  });
  const [totalPlants, setTotalPlants] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { shouldRefresh, setShouldRefresh } = useRefresh();

  const loadData = async () => {
    try {
      // Load user info
      const info = await getUserInfo();
      setUserInfo({
        firstName: info.firstName || '',
        lastName: info.lastName || '',
        email: info.email || '',
        avatarUrl: info.avatarUrl || 'https://i.pravatar.cc/300',
      });

      // Check unread notifications
      console.log('Checking unread notifications...');
      const unreadCount = await getUnreadCount();
      console.log('Unread notifications count:', unreadCount);
      setUnreadNotifications(unreadCount);
      console.log('Updated unreadNotifications state:', unreadCount);

      // Load total plants
      const response = await getPlants(0);
      setTotalPlants(response.totalElements);
    } catch (error) {
      console.error('Error in loadData:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (shouldRefresh) {
      loadData();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  useEffect(() => {
    loadData();
  }, []);

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
    { id: '2', name: 'Settings', icon: 'settings-outline', color: '#9C27B0', onPress: () => router.push('/settings') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7F4]">
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7F4" />
      
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      {/* Header */}
      <LinearGradient
        colors={['#F0F7F4', '#E8F5E9']}
        className="px-5 pt-4 pb-2"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity 
              className="w-12 h-12 rounded-full overflow-hidden shadow-sm"
              onPress={() => router.push('/profile')}
            >
              <Image 
                source={{ uri: userInfo.avatarUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View className="ml-3">
              <Text className="text-sm text-gray-600">Welcome back</Text>
              <Text className="text-2xl font-bold text-[#2B5329]">{userInfo.firstName || 'Plant Care'}</Text>
            </View>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
              onPress={() => router.push('/notifications')}
            >
              {unreadNotifications > 0 && (
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              )}
              <Ionicons name="notifications" size={22} color="#2B5329" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      >
        {/* Hero Section */}
        <View className="px-5 pt-2">
          <HeroSection 
            onScanPress={() => console.log('Scan pressed')}
            totalPlants={totalPlants}
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
        <View className="px-6 py-4">
          <Text className="text-xl font-bold text-[#2B5329] mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                onPress={action.onPress}
                className="w-[48%] bg-white rounded-xl p-4 mb-4 items-center"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
              >
                <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: `${action.color}20` }}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text className="text-[#2B5329] font-medium">{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Plants */}
        <PlantList
          title="Recent Plants"
          subtitle="Your recently added plants"
          limit={5}
        />

        {/* Farms
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
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;