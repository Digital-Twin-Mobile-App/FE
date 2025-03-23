import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleRegister = () => {
    // Implement Google registration
    console.log('Google register pressed');
  };

  const handleEmailRegister = () => {
    // Implement email registration
    console.log('Email register pressed');
  };

  const handleSSORegister = () => {
    // Implement SSO registration
    console.log('SSO register pressed');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="h-1/3 rounded-b-3xl"
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
          <Text className="text-white text-lg">Sign up to get started</Text>
        </View>
      </LinearGradient>

      <View className="flex-1 px-6 pt-8">
        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 text-sm mb-2">Full Name</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text className="text-gray-700 text-sm mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 text-sm mb-2">Password</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-gray-700 text-sm mb-2">Confirm Password</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleEmailRegister}
            className="bg-blue-600 p-4 rounded-xl mt-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <TouchableOpacity
            onPress={handleGoogleRegister}
            className="flex-row items-center justify-center bg-white border border-gray-300 p-4 rounded-xl"
          >
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              className="w-6 h-6 mr-2"
            />
            <Text className="text-gray-700 font-semibold">
              Sign up with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSSORegister}
            className="flex-row items-center justify-center bg-white border border-gray-300 p-4 rounded-xl"
          >
            <Text className="text-gray-700 font-semibold">
              Sign up with SSO
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
} 