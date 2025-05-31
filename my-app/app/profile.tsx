import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { logout } from '../services/auth';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">
        <View className="items-center mt-16 mb-8">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Profile</Text>
          
          <TouchableOpacity
            className="bg-red-600 rounded-full py-4 mb-4 w-full"
            onPress={handleLogout}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ProfileScreen; 