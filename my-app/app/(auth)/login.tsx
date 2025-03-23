import React, { useRef, useEffect } from 'react';
import { SafeAreaView, Animated, TouchableOpacity, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">

        {/* Logo + App Name (dropped lower) */}
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

        {/* Auth Card  */}
        <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg mt-22">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Welcome Back</Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-green-600 rounded-full py-4 mb-4 shadow-md">
            <FontAwesome name="google" size={20} color="white" />
            <Text className="ml-3 text-white font-semibold text-lg">Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-center border border-green-600 rounded-full py-4 mb-4">
            <FontAwesome name="envelope" size={20} color="#34A853" />
            <Text className="ml-3 text-green-700 font-semibold text-lg">Continue with Email</Text>
          </TouchableOpacity>
          <Link href="/sso" asChild>
            <TouchableOpacity className="mt-2">
              <Text className="text-green-700 underline text-center">Use SSO</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-white text-lg">Don’t have an account? </Text>
          <Link href="/signup"><Text className="text-white font-semibold underline">Sign Up</Text></Link>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
