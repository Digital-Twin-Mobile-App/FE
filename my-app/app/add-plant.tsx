import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, Modal, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

// Mock data for plant types
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
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageOptions, setShowImageOptions] = useState(false);

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

  const handleSubmit = () => {
    // TODO: Implement plant creation logic
    console.log({
      name: plantName,
      type: plantType,
      notes,
      image,
    });
    router.back();
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
          className="bg-[#4CAF50] rounded-xl py-4 mt-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Add Plant
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

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">Add Photo</Text>
            <TouchableOpacity onPress={() => setShowImageOptions(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          <View className="p-4 space-y-4">
            <TouchableOpacity
              onPress={() => pickImage(true)}
              className="flex-row items-center p-4 bg-gray-50 rounded-xl"
            >
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/20 items-center justify-center mr-4">
                <Ionicons name="camera" size={24} color="#4CAF50" />
              </View>
              <Text className="text-[#2B5329] text-lg">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickImage(false)}
              className="flex-row items-center p-4 bg-gray-50 rounded-xl"
            >
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/20 items-center justify-center mr-4">
                <Ionicons name="images" size={24} color="#4CAF50" />
              </View>
              <Text className="text-[#2B5329] text-lg">Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 