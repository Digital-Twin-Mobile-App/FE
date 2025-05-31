import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getUserInfo, updateUserInfo } from '../services/user';

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserInfo();
      setUser({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        avatarUrl: userInfo.avatarUrl || 'https://i.pravatar.cc/300',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load user info');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!user.firstName || !user.lastName) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    try {
      setSaving(true);
      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName,
      } as any;

      if (selectedImage) {
        updateData.avatar = {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        };
      }

      await updateUserInfo(updateData);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />

      <View className="px-6 py-4">
        <View className="items-center mb-6">
          <View className="relative">
            <Image
              source={{ uri: selectedImage || user.avatarUrl || 'https://i.pravatar.cc/300' }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-white rounded-full p-2"
              onPress={handlePickImage}
            >
              <Text className="text-gray-800">Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">First Name</Text>
            <TextInput
              className="bg-white rounded-lg p-3"
              placeholder="Enter your first name"
              value={user.firstName}
              onChangeText={(text) => setUser(prev => ({ ...prev, firstName: text }))}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Last Name</Text>
            <TextInput
              className="bg-white rounded-lg p-3"
              placeholder="Enter your last name"
              value={user.lastName}
              onChangeText={(text) => setUser(prev => ({ ...prev, lastName: text }))}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Email</Text>
            <TextInput
              className="bg-white rounded-lg p-3"
              placeholder="Enter your email"
              value={user.email}
              editable={false}
            />
          </View>

          <TouchableOpacity 
            className="bg-green-600 rounded-full py-4 mt-6"
            onPress={handleSave}
            disabled={saving}
          >
            <Text className="text-white font-semibold text-lg text-center">
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 