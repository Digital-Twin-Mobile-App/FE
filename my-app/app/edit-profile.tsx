import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Alert, ScrollView, Modal, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileData {
  avatar: string;
  background: string;
  name: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export default function EditProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: 'https://i.pravatar.cc/300',
    background: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    name: 'John Doe',
    bio: 'Plant Enthusiast',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    website: 'www.example.com'
  });

  const [tempData, setTempData] = useState<ProfileData>(profileData);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageType, setImageType] = useState<'avatar' | 'background'>('avatar');

  const pickImage = async (type: 'avatar' | 'background') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setTempData(prev => ({
        ...prev,
        [type]: result.assets[0].uri
      }));
    }
  };

  const takePhoto = async (type: 'avatar' | 'background') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setTempData(prev => ({
        ...prev,
        [type]: result.assets[0].uri
      }));
    }
  };

  const handleImagePress = (type: 'avatar' | 'background') => {
    setImageType(type);
    setShowImagePicker(true);
  };

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFieldSave = (field: keyof ProfileData) => {
    setProfileData(prev => ({
      ...prev,
      [field]: tempData[field]
    }));
    Alert.alert('Success', `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
  };

  const handleUpdateProfile = () => {
    setProfileData(tempData);
    Alert.alert('Success', 'Profile updated successfully!');
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView className="flex-1">
        <View className="relative h-48">
          <TouchableOpacity onPress={() => handleImagePress('background')}>
            <Image
              source={{ uri: tempData.background }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
        </View>

        <View className="px-4">
          <View className="relative -mt-16 mb-6">
            <TouchableOpacity onPress={() => handleImagePress('avatar')}>
              <View className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                <Image
                  source={{ uri: tempData.avatar }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          </View>

          <View className="space-y-6">
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm mb-2">Name</Text>
              <TextInput
                className="text-gray-800 text-lg font-medium"
                value={tempData.name}
                onChangeText={(value) => handleFieldChange('name', value)}
                placeholder="Your name"
                style={{ padding: Platform.OS === 'ios' ? 8 : 4 }}
              />
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm mb-2">Bio</Text>
              <TextInput
                className="text-gray-800 text-base"
                value={tempData.bio}
                onChangeText={(value) => handleFieldChange('bio', value)}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                style={{ padding: Platform.OS === 'ios' ? 8 : 4 }}
              />
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm mb-2">Email</Text>
              <TextInput
                className="text-gray-800 text-base"
                value={tempData.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                placeholder="Your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ padding: Platform.OS === 'ios' ? 8 : 4 }}
              />
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm mb-2">Phone</Text>
              <TextInput
                className="text-gray-800 text-base"
                value={tempData.phone}
                onChangeText={(value) => handleFieldChange('phone', value)}
                placeholder="Your phone number"
                keyboardType="phone-pad"
                style={{ padding: Platform.OS === 'ios' ? 8 : 4 }}
              />
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm mb-2">Location</Text>
              <TextInput
                className="text-gray-800 text-base"
                value={tempData.location}
                onChangeText={(value) => handleFieldChange('location', value)}
                placeholder="Your location"
                style={{ padding: Platform.OS === 'ios' ? 8 : 4 }}
              />
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm mb-2">Website</Text>
              <TextInput
                className="text-gray-800 text-base"
                value={tempData.website}
                onChangeText={(value) => handleFieldChange('website', value)}
                placeholder="Your website"
                keyboardType="url"
                autoCapitalize="none"
                style={{ padding: Platform.OS === 'ios' ? 8 : 4 }}
              />
            </View>
          </View>

          <TouchableOpacity 
            className="mt-8 mb-8 flex-row items-center justify-center bg-[#4CAF50] rounded-xl p-4 shadow-sm active:scale-[0.98]"
            onPress={handleUpdateProfile}
          >
            <Text className="text-white text-base font-medium">Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Change {imageType === 'avatar' ? 'Profile Picture' : 'Background'}
              </Text>
              <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              className="flex-row items-center bg-gray-100 rounded-xl p-4 mb-3"
              onPress={() => {
                setShowImagePicker(false);
                takePhoto(imageType);
              }}
            >
              <Ionicons name="camera" size={24} color="#4CAF50" />
              <Text className="text-gray-800 text-base ml-3">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center bg-gray-100 rounded-xl p-4"
              onPress={() => {
                setShowImagePicker(false);
                pickImage(imageType);
              }}
            >
              <Ionicons name="images" size={24} color="#4CAF50" />
              <Text className="text-gray-800 text-base ml-3">Choose from Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
} 