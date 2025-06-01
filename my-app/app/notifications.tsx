import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getNotificationsByType, getUnreadNotifications, markAllAsRead, type Notification } from '../services/notification';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [unread, all] = await Promise.all([
        getUnreadNotifications(),
        getNotificationsByType('PLANT_STAGE_CHANGE')
      ]);
      
      // Combine unread and all notifications, ensuring unread ones are at the top
      const unreadIds = new Set(unread.map(n => n.id));
      const allNotifications = all.content.filter(n => !unreadIds.has(n.id));
      setNotifications([...unread, ...allNotifications]);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    return () => {
      // Mark all as read when leaving the screen
      markAllAsRead().catch(console.error);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7F4" />
      
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View className="flex-1 mt-12">
        <ScrollView className="flex-1">
          {notifications.map((notification) => (
            <View
              key={notification.id}
              className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-green-50' : ''}`}
            >
              <View className="flex-row items-start">
                <View className="w-10 h-10 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-3">
                  <Ionicons name="leaf" size={20} color="#4CAF50" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-[#2B5329]">{notification.title}</Text>
                  <Text className="text-gray-600 mt-1">{notification.content}</Text>
                  <Text className="text-gray-400 text-sm mt-2">{formatDate(notification.createdAt)}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
} 