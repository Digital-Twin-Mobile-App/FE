import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUnreadCount } from '../../services/notification';
import { getUserProfile } from '../../services/user';
import type { User } from '../../services/user';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Link } from 'expo-router';

export default function TabOneScreen() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const checkUnreadNotifications = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error checking unread notifications:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  useEffect(() => {
    checkUnreadNotifications();
    loadUserProfile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          title: 'Home',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/notifications')}
              className="relative"
            >
              <Ionicons name="notifications-outline" size={24} color="#4CAF50" />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3" />
              )}
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/100' }}
              className="w-16 h-16 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-xl font-bold text-[#2B5329]">
                {user?.fullName || 'User'}
              </Text>
              <Text className="text-gray-600">{user?.email}</Text>
            </View>
          </View>

          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-[#2B5329] mb-2">Welcome Back!</Text>
            <Text className="text-gray-600">
              Track your plants' growth and get personalized care tips.
            </Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>Tab One</Text>
            <View style={styles.separator} />
            <EditScreenInfo path="app/(tabs)/index.tsx" />
            <Link href="/onboarding" >Onboarding</Link>
            <Link href="/login" >Login</Link>
            <Link href="/signup" >Signup</Link>
            <Link href="/sso" >SSO</Link>
            <Link href="/forgot-password" >Forgot Password</Link> 
            <Link href="/profile" >Profile</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
