import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, Animated, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { verifyEmail, verifyOTP, changePassword } from '../../services/auth';

export default function ForgotPasswordScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);

  const handleVerifyEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const response = await verifyEmail(email);
      if (response.code === 200) {
        setStep(2);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOTP(email, otp);
      if (response.code === 200) {
        setStep(3);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

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
      await changePassword(email, newPassword, confirmPassword);
      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#A8E6CF", "#56AB2F"]} className="flex-1 px-6 pt-8">
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
        
        <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg mt-22">
          <Text className="text-4xl font-bold text-green-700 text-center mb-6">Reset Password</Text>
          
          {step === 1 && (
            <>
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

              <TouchableOpacity 
                className="bg-green-600 rounded-full py-4 mb-4 shadow-md"
                onPress={handleVerifyEmail}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg text-center">
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">OTP</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity 
                className="bg-green-600 rounded-full py-4 mb-4 shadow-md"
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg text-center">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">New Password</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 mb-2">Confirm Password</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                className="bg-green-600 rounded-full py-4 mb-4 shadow-md"
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg text-center">
                  {loading ? 'Changing...' : 'Change Password'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-white text-lg">Remember your password? </Text>
          <Link href="/login"><Text className="text-white font-semibold underline">Login</Text></Link>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
