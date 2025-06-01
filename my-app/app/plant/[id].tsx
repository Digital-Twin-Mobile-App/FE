import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getPlantDetails, uploadPlantImage } from '../../services/plant';
import type { Plant } from '../../services/plant';

export default function PlantDetail() {
  const { id, name, coverImage } = useLocalSearchParams();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPlantDetails();
  }, [id]);

  const loadPlantDetails = async () => {
    try {
      setLoading(true);
      const plantData = await getPlantDetails(id as string);
      setPlant({
        ...plantData,
        name: name as string || 'Unnamed Plant',
        plantCoverUrl: coverImage as string
      });
      setError(null);
    } catch (err: any) {
      console.error('Error loading plant details:', err);
      setError(err.message || 'Failed to load plant details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      console.log('Starting upload process...');
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        console.log('Permission denied');
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Pick image
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log('Image picker result:', result);

      if (!result.canceled) {
        console.log('Image selected, starting upload...');
        setUploading(true);
        const image = result.assets[0];
        console.log('Selected image details:', {
          uri: image.uri,
          width: image.width,
          height: image.height,
          type: image.type,
          size: image.fileSize
        });

        await uploadPlantImage(id as string, {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'plant-image.jpg'
        });
        
        console.log('Upload successful, reloading plant details...');
        // Reload plant details after successful upload
        await loadPlantDetails();
        console.log('Plant details reloaded successfully');
        Alert.alert('Success', 'Image uploaded successfully');
      } else {
        console.log('Image selection cancelled');
      }
    } catch (err: any) {
      console.error('Error in handleUpload:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      Alert.alert('Error', err.message || 'Failed to upload image');
    } finally {
      console.log('Upload process completed');
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-[#4CAF50] px-4 py-2 rounded-lg"
          onPress={loadPlantDetails}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!plant) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Plant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <ScrollView className="flex-1">
        <View className="relative h-80 mt-12">
          <Image
            source={{ 
              uri: plant.plantCoverUrl || 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=60'
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          <View className="absolute bottom-0 left-0 right-0 p-6">
            <Text className="text-white text-3xl font-bold">{plant.name}</Text>
          </View>
        </View>

        <View className="p-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-[#2B5329]">Plant Details</Text>
              <Text className="text-gray-600">All about your plant</Text>
            </View>
            <View className="items-center">
              <TouchableOpacity 
                className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mb-1"
                onPress={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <Ionicons name="cloud-upload" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
              <Text className="text-xs text-[#4CAF50]">Analyze Plant</Text>
            </View>
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="leaf" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Plant Stage</Text>
                <Text className="text-gray-600">{plant.plantStage || 'Please upload image'}</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                <Ionicons name="flower" size={24} color="#4CAF50" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-[#2B5329]">Detected Species</Text>
                <Text className="text-gray-600">{plant.detectedSpecies || 'Please upload image'}</Text>
              </View>
            </View>

            {plant.mediaUrl && (
              <View className="mt-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-semibold text-[#2B5329]">Latest Image</Text>
                  <TouchableOpacity 
                    onPress={() => router.push(`/plant/${id}/history`)}
                    className="flex-row items-center"
                  >
                    <Text className="text-[#4CAF50] mr-1">View All</Text>
                    <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: plant.mediaUrl }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Latest Data Section */}
            <View className="mt-6">
              <View className="bg-gray-50 rounded-xl p-4 space-y-4">
                {plant.latestData?.height && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Height</Text>
                    <Text className="font-semibold text-[#2B5329]">{plant.latestData.height} cm</Text>
                  </View>
                )}
                
                {plant.latestData?.leafCount && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Leaf Count</Text>
                    <Text className="font-semibold text-[#2B5329]">{plant.latestData.leafCount} leaves</Text>
                  </View>
                )}
                
                {plant.latestData?.healthScore && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Health Score</Text>
                    <Text className="font-semibold text-[#2B5329]">{plant.latestData.healthScore}/100</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 