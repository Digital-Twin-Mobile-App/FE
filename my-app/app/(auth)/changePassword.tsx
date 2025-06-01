import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://c35c-171-243-49-189.ngrok-free.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.code === 200 && data.result.authenticated) {
        // Store the token
        await AsyncStorage.setItem('userToken', data.result.token);
        router.replace('/');
      } else {
        throw new Error('Password change failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">
        <View className="items-center mt-16 mb-8">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Set Your Password</Text>
          
          <TextInput
            placeholder="New Password"
            className="border border-gray-300 rounded-full px-4 py-3 mb-4 w-full bg-white"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          
          <TextInput
            placeholder="Confirm Password"
            className="border border-gray-300 rounded-full px-4 py-3 mb-6 w-full bg-white"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            className="bg-green-600 rounded-full py-4 mb-4 w-full"
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Setting Password...' : 'Set Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
} 