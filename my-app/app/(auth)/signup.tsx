import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, Animated, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { FontAwesome } from '@expo/vector-icons';

export default function SignupScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start(), []);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">
        <View className="items-center mt-16 mb-8">
          <Animated.Image source={require('../../assets/images/plant-logo.png')} style={{ width: 192, height: 192, transform: [{ scale: scaleAnim }] }} resizeMode="contain" />
          <MaskedView style={{ width: '100%', alignItems: 'center' }} maskElement={<Text className="text-3xl font-extrabold text-white text-center">Plantypheno</Text>}>
            <LinearGradient colors={["#FF5F6D", "#FFC371", "#3A1C71", "#00C9FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', alignItems: 'center' }}>
              <Text className="text-3xl font-extrabold opacity-0">Plantypheno</Text>
            </LinearGradient>
          </MaskedView>
        </View>
        <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg mt-22">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Create Account</Text>
          <TextInput placeholder="Email" keyboardType="email-address" className="border border-gray-300 rounded-full px-4 py-3 mb-4" value={email} onChangeText={setEmail} />
          <TextInput placeholder="Password" secureTextEntry className="border border-gray-300 rounded-full px-4 py-3 mb-6" value={password} onChangeText={setPassword} />
          <TouchableOpacity className="bg-green-600 rounded-full py-4 mb-4">
            <Text className="text-white text-center font-semibold text-lg">Sign Up</Text>
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/login"><Text className="text-green-700 font-semibold">Log In</Text></Link>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}