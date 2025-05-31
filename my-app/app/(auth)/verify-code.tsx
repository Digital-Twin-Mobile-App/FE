import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { verifyOTP } from '../../services/auth';

export default function VerifyCodeScreen() {
  const { email, isForgotPassword } = useLocalSearchParams<{ email: string, isForgotPassword: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      const data = await verifyOTP(email, code);

      if (data.code === 200 && data.result.authenticated) {
        router.replace({
          pathname: '/changePassword',
          params: { email }
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">
        <View className="items-center mt-16 mb-8">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Verify Your Email</Text>
          <Text className="text-white text-center mb-6">Please enter the verification code sent to your email</Text>
          
          <TextInput
            placeholder="Enter verification code"
            className="border border-gray-300 rounded-full px-4 py-3 mb-6 w-full bg-white"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          
          <TouchableOpacity
            className="bg-green-600 rounded-full py-4 mb-4 w-full"
            onPress={handleVerifyCode}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Verifying...' : 'Verify Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
} 