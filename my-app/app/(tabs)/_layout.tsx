import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F7F4" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: '#9E9E9E',
            headerShown: false,
          }}
          initialRouteName="home"
        >
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="watering"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="plants"
            options={{
              title: 'Plants',
              tabBarIcon: ({ color }) => <Ionicons name="leaf-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
