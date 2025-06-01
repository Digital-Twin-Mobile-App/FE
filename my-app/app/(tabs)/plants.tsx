import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import PlantList from '../../components/PlantList';

const Plants = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#F0F7F4]">
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7F4" />
      
      <Stack.Screen 
        options={{
          title: 'My Plants',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />

      <PlantList
        title="My Plants"
        subtitle="All your plants in one place"
        showPagination={true}
      />
    </SafeAreaView>
  );
};

export default Plants; 