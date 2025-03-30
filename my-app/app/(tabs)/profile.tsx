import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, Dimensions, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

type IconName = keyof typeof Ionicons.glyphMap;

interface Stat {
  label: string;
  value: string;
  icon: IconName;
}

interface MenuItem {
  icon: IconName;
  label: string;
  color: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/300');
  const [background, setBackground] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60');

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [300, 100],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  const avatarTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 50],
    extrapolate: 'clamp',
  });

  const stats: Stat[] = [
    { label: 'Plants', value: '12', icon: 'leaf' },
    { label: 'Farms', value: '3', icon: 'home' },
    { label: 'Favorites', value: '5', icon: 'heart' },
    { label: 'Watering', value: '3', icon: 'water' },
  ];

  const menuItems: MenuItem[] = [
    { 
      icon: 'person', 
      label: 'Edit Profile', 
      color: '#4CAF50',
      onPress: () => router.push('/edit-profile')
    },
    { 
      icon: 'notifications', 
      label: 'Notifications', 
      color: '#2196F3',
      onPress: () => router.push('/notifications')
    },
    { 
      icon: 'settings', 
      label: 'Settings', 
      color: '#FF9800',
      onPress: () => router.push('/settings')
    },
    { 
      icon: 'help-circle', 
      label: 'Help & Support', 
      color: '#9C27B0',
      onPress: () => Alert.alert('Help & Support', 'Need help? Contact us at support@example.com')
    },
    { 
      icon: 'information-circle', 
      label: 'About', 
      color: '#607D8B',
      onPress: () => Alert.alert('About', 'Plant Care App v1.0.0\n\nYour personal plant management companion.')
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Add your logout logic here
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />

      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#4CAF50"
            colors={['#4CAF50']}
          />
        }
      >
        <Animated.View 
          className="relative"
          style={{ height: headerHeight }}
        >
          <Image
            source={{ uri: background }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          
          <Animated.View 
            className="absolute bottom-0 left-0 right-0 items-center"
            style={{
              transform: [
                { scale: avatarScale },
                { translateY: avatarTranslateY }
              ]
            }}
          >
            <View className="relative">
              <View className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                <Image
                  source={{ uri: avatar }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity 
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white items-center justify-center border-2 border-[#4CAF50]"
                onPress={() => router.push('/edit-profile')}
              >
                <Ionicons name="camera" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            <Text className="text-white text-2xl font-bold mt-2">John Doe</Text>
            <Text className="text-white/80 text-base">Plant Enthusiast</Text>
          </Animated.View>
        </Animated.View>

        <View className="px-6 py-4">
          <View className="flex-row justify-between bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mb-2">
                  <Ionicons name={stat.icon} size={24} color="#4CAF50" />
                </View>
                <Text className="text-xl font-bold text-[#2B5329]">{stat.value}</Text>
                <Text className="text-gray-600 text-sm">{stat.label}</Text>
              </View>
            ))}
          </View>

          <View className="mt-6 space-y-3">
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                className="flex-row items-center bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-sm active:scale-[0.98]"
                onPress={item.onPress}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4`} style={{ backgroundColor: `${item.color}20` }}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text className="text-gray-800 text-base flex-1">{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            className="mt-6 flex-row items-center justify-center bg-red-50 rounded-xl p-4 shadow-sm active:scale-[0.98]"
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#EF4444" />
            <Text className="text-red-500 text-base font-medium ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
