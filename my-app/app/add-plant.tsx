import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createPlant } from '../services/plant';
import { useRefresh } from '../context/RefreshContext';

export default function AddPlant() {
  const router = useRouter();
  const { refreshHome } = useRefresh();
  const [plantName, setPlantName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3] as [number, number],
      quality: 1,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    setShowImageOptions(false);
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Error', 'Please add a plant photo');
      return;
    }

    if (!plantName.trim()) {
      Alert.alert('Error', 'Please enter a plant name');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating plant with name:', plantName);
      console.log('Image URI:', image);
      
      const result = await createPlant(plantName, {
        uri: image,
        type: 'image/jpeg',
        name: 'plant.jpg'
      });

      console.log('Plant created successfully:', result);
      refreshHome();
      router.back();
    } catch (error: any) {
      console.error('Error creating plant:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create plant. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          title: 'Add New Plant',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView className="flex-1 p-6">
        {/* Image Upload */}
        <TouchableOpacity 
          onPress={() => setShowImageOptions(true)}
          className="w-full h-64 bg-gray-100 rounded-2xl items-center justify-center mb-8 overflow-hidden"
        >
          {image ? (
            <Image 
              source={{ uri: image }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="camera-outline" size={48} color="#9E9E9E" />
              <Text className="text-gray-500 mt-3 text-lg">Tap to add plant photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Plant Name */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-[#2B5329] mb-3">Plant Name</Text>
          <TextInput
            value={plantName}
            onChangeText={setPlantName}
            placeholder="Enter plant name"
            className="bg-gray-50 rounded-xl p-4 text-lg"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={isLoading}
          className={`rounded-xl py-5 mt-4 ${isLoading ? 'bg-gray-400' : 'bg-[#4CAF50]'}`}
        >
          <Text className="text-white text-center font-semibold text-xl">
            {isLoading ? 'Adding Plant...' : 'Add Plant'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/50" onTouchEnd={() => setShowImageOptions(false)}>
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-xl font-semibold text-center text-[#2B5329]">Add Plant Photo</Text>
            </View>
            
            <TouchableOpacity 
              className="p-5 flex-row items-center justify-center border-b border-gray-100"
              onPress={() => pickImage(true)}
            >
              <Ionicons name="camera" size={28} color="#4CAF50" className="mr-2" />
              <Text className="text-lg ml-2 text-[#2B5329]">Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="p-5 flex-row items-center justify-center"
              onPress={() => pickImage(false)}
            >
              <Ionicons name="images" size={28} color="#4CAF50" className="mr-2" />
              <Text className="text-lg ml-2 text-[#2B5329]">Choose from Library</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="p-5 border-t border-gray-200"
              onPress={() => setShowImageOptions(false)}
            >
              <Text className="text-red-500 text-lg text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 