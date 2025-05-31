import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, Modal, FlatList, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://c5af-171-243-49-189.ngrok-free.app';

// Plant status options
const plantStatus = [
  'HEALTHY',
  'UNHEALTHY',
  'NEEDS_CARE'
];

// Watering frequency options
const wateringFrequency = [
  'DAILY',
  'WEEKLY',
  'BIWEEKLY',
  'MONTHLY'
];

// Plant types
const plantTypes = [
  'Indoor Plants',
  'Outdoor Plants',
  'Succulents',
  'Herbs',
  'Flowers',
  'Trees',
  'Shrubs',
  'Vegetables',
  'Fruits',
  'Tropical Plants',
  'Aquatic Plants',
  'Cacti',
  'Bonsai',
  'Orchids',
  'Ferns',
];

export default function AddPlant() {
  const router = useRouter();
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState('HEALTHY');
  const [frequency, setFrequency] = useState('DAILY');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPlantTypes = plantTypes.filter(type =>
    type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

    setIsLoading(true);
    try {
      // Get the auth token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'plant.jpg'
      } as any);

      const response = await fetch(`${API_URL}/plants/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add plant');
      }

      const data = await response.json();
      console.log('Plant created successfully:', data);
      Alert.alert('Success', 'Plant created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error creating plant:', error);
      if (error.message === 'Authentication failed. Please login again.') {
        Alert.alert('Session Expired', 'Please login again to continue.', [
          { text: 'OK', onPress: () => router.push('/login') }
        ]);
      } else {
        Alert.alert('Error', error.message || 'Failed to create plant. Please try again.');
      }
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
          className="w-full h-48 bg-gray-100 rounded-2xl items-center justify-center mb-6 overflow-hidden"
        >
          {image ? (
            <Image 
              source={{ uri: image }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="camera-outline" size={40} color="#9E9E9E" />
              <Text className="text-gray-500 mt-2">Tap to add plant photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Plant Name */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-[#2B5329] mb-2">Plant Name</Text>
          <TextInput
            value={plantName}
            onChangeText={setPlantName}
            placeholder="Enter plant name"
            className="bg-gray-50 rounded-xl p-4 text-base"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        {/* Plant Type */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-[#2B5329] mb-2">Plant Type</Text>
          <TouchableOpacity 
            onPress={() => setShowTypeModal(true)}
            className="bg-gray-50 rounded-xl p-4 flex-row justify-between items-center"
          >
            <Text className={plantType ? "text-[#2B5329]" : "text-gray-400"}>
              {plantType || "Select plant type"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Plant Status */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-[#2B5329] mb-2">Plant Status</Text>
          <TouchableOpacity 
            onPress={() => setShowStatusModal(true)}
            className="bg-gray-50 rounded-xl p-4 flex-row justify-between items-center"
          >
            <Text className="text-[#2B5329]">{status}</Text>
            <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Watering Frequency */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-[#2B5329] mb-2">Watering Frequency</Text>
          <TouchableOpacity 
            onPress={() => setShowFrequencyModal(true)}
            className="bg-gray-50 rounded-xl p-4 flex-row justify-between items-center"
          >
            <Text className="text-[#2B5329]">{frequency}</Text>
            <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-[#2B5329] mb-2">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes about your plant..."
            className="bg-gray-50 rounded-xl p-4 text-base"
            placeholderTextColor="#9E9E9E"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={isLoading}
          className={`rounded-xl py-4 mt-4 ${isLoading ? 'bg-gray-400' : 'bg-[#4CAF50]'}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isLoading ? 'Adding Plant...' : 'Add Plant'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Plant Type Modal */}
      <Modal
        visible={showTypeModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">Select Plant Type</Text>
            <TouchableOpacity onPress={() => setShowTypeModal(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
          
          <View className="p-4">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search plant types..."
              className="bg-gray-50 rounded-xl p-4 mb-4"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <FlatList
            data={filteredPlantTypes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setPlantType(item);
                  setShowTypeModal(false);
                }}
                className="p-4 border-b border-gray-100"
              >
                <Text className="text-[#2B5329]">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Status Modal */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">Select Plant Status</Text>
            <TouchableOpacity onPress={() => setShowStatusModal(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={plantStatus}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setStatus(item);
                  setShowStatusModal(false);
                }}
                className="p-4 border-b border-gray-100"
              >
                <Text className="text-[#2B5329]">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Frequency Modal */}
      <Modal
        visible={showFrequencyModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">Select Watering Frequency</Text>
            <TouchableOpacity onPress={() => setShowFrequencyModal(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={wateringFrequency}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setFrequency(item);
                  setShowFrequencyModal(false);
                }}
                className="p-4 border-b border-gray-100"
              >
                <Text className="text-[#2B5329]">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

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
              className="p-4 flex-row items-center justify-center border-b border-gray-100"
              onPress={() => pickImage(true)}
            >
              <Ionicons name="camera" size={24} color="#4CAF50" className="mr-2" />
              <Text className="text-lg ml-2 text-[#2B5329]">Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="p-4 flex-row items-center justify-center"
              onPress={() => pickImage(false)}
            >
              <Ionicons name="images" size={24} color="#4CAF50" className="mr-2" />
              <Text className="text-lg ml-2 text-[#2B5329]">Choose from Library</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="p-4 border-t border-gray-200"
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