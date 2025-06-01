import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, Animated, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { login } from '../../services/auth';

export default function LoginScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">
        {/* Logo + App Name */}
        <View className="items-center mt-16 mb-7">
          <Animated.Image
            source={require('../../assets/images/plant-logo.png')}
            style={{ width: 192, height: 192, transform: [{ scale: scaleAnim }] }}
            resizeMode="contain"
          />
          <MaskedView
            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
            maskElement={
              <Text className="text-3xl font-extrabold text-white text-center">Plantypheno</Text>
            }
          >
            <LinearGradient
              colors={["#FF5F6D", "#FFC371", "#3A1C71", "#00C9FF"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-3xl font-extrabold opacity-0 text-center">Plantypheno</Text>
            </LinearGradient>
          </MaskedView>
        </View>

        {/* Auth Card */}
        <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg mt-22">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Welcome Back</Text>
          
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            className="bg-green-600 rounded-full py-4 mb-4 shadow-md"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg text-center">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <Link href="/forgot-password" asChild>
            <TouchableOpacity className="mt-2">
              <Text className="text-green-700 underline text-center">Forgot Password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-white text-lg">Don't have an account? </Text>
          <Link href="/signup"><Text className="text-white font-semibold underline">Sign Up</Text></Link>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
