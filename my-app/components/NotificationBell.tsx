import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUnreadCount } from '../services/notification';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Refresh count every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity 
      onPress={() => router.push('/notifications')}
      className="relative"
    >
      <Ionicons name="notifications-outline" size={24} color="#4CAF50" />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
          <Text className="text-white text-xs">{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
} 