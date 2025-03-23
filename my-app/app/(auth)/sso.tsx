import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { FontAwesome } from '@expo/vector-icons';

export default function SSOScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [companyId, setCompanyId] = useState('');

  useEffect(() => Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start(), []);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">
        <View className="items-center mt-16 mb-8">
          <Animated.Image source={require('../../assets/images/plant-logo.png')} style={{ width: 192, height: 192, transform: [{ scale: scaleAnim }] }} resizeMode="contain" />
          <MaskedView maskElement={<Text className="text-3xl font-extrabold text-white text-center">Plantypheno</Text>} style={{ width: '100%', alignItems: 'center' }}>
            <LinearGradient colors={["#FF5F6D", "#FFC371", "#3A1C71", "#00C9FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', alignItems: 'center' }}>
              <Text className="text-3xl font-extrabold opacity-0">Plantypheno</Text>
            </LinearGradient>
          </MaskedView>
        </View>
        <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg mt-22">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Sign in with SSO</Text>
          <TextInput placeholder="Company ID" className="border border-gray-300 rounded-full px-4 py-3 mb-6" value={companyId} onChangeText={setCompanyId} />
          <TouchableOpacity className="bg-green-600 rounded-full py-4 mb-4">
            <Text className="text-white text-center font-semibold text-lg">Continue</Text>
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <Link href="/login"><Text className="text-green-700 font-semibold">Back to Login</Text></Link>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}