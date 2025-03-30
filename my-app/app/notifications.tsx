import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'watering' | 'care' | 'system';
  read: boolean;
}

export default function NotificationsScreen() {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Watering Reminder',
      message: 'Your Monstera needs watering today!',
      time: '2 hours ago',
      type: 'watering',
      read: false
    },
    {
      id: '2',
      title: 'Care Tip',
      message: 'Check out this new care guide for your Snake Plant',
      time: '5 hours ago',
      type: 'care',
      read: true
    },
    {
      id: '3',
      title: 'System Update',
      message: 'New features available in the latest update',
      time: '1 day ago',
      type: 'system',
      read: true
    }
  ];

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'watering':
        return 'water';
      case 'care':
        return 'leaf';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'watering':
        return '#4CAF50';
      case 'care':
        return '#2196F3';
      case 'system':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView className="flex-1 p-4">
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            className={`flex-row items-start bg-white rounded-xl p-4 mb-3 shadow-sm ${!notification.read ? 'border-l-4' : ''}`}
            style={{ borderLeftColor: !notification.read ? getNotificationColor(notification.type) : 'transparent' }}
          >
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-4 mt-1"
              style={{ backgroundColor: `${getNotificationColor(notification.type)}20` }}
            >
              <Ionicons name={getNotificationIcon(notification.type)} size={20} color={getNotificationColor(notification.type)} />
            </View>
            
            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text className={`text-base font-medium ${notification.read ? 'text-gray-800' : 'text-black'}`}>
                  {notification.title}
                </Text>
                <Text className="text-gray-500 text-sm">{notification.time}</Text>
              </View>
              <Text className="text-gray-600 mt-1">{notification.message}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
} 