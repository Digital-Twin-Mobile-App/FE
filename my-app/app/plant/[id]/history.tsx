import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPlantHistory, type PlantHistory } from '../../../services/plant';

export default function PlantHistoryScreen() {
  const { id, name } = useLocalSearchParams();
  const [history, setHistory] = useState<PlantHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const loadHistory = async (pageNum: number = 0) => {
    try {
      setLoading(true);
      const response = await getPlantHistory(id as string, pageNum);
      if (pageNum === 0) {
        setHistory(response.content);
      } else {
        setHistory(prev => [...prev, ...response.content]);
      }
      setHasMore(response.number < response.totalPages - 1);
      setError(null);
    } catch (err: any) {
      console.error('Error loading plant history:', err);
      setError(err.message || 'Failed to load plant history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [id]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadHistory(nextPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          title: 'Plant History',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        className="flex-1"
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {history.map((item) => (
          <View key={item.imageId} className="p-4 border-b border-gray-100">
            <Image
              source={{ uri: item.mediaUrl }}
              className="w-full h-64 rounded-lg mb-3"
              resizeMode="cover"
            />
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-[#2B5329]">
                  {item.plantStage || 'Unknown Stage'}
                </Text>
                <Text className="text-gray-600">
                  {item.detectedSpecies || 'Species not detected'}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Uploaded by {item.uploaderName}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {formatDate(item.uploadDate)}
                </Text>
              </View>
            </View>
          </View>
        ))}
        
        {loading && (
          <View className="py-4">
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}
        
        {error && (
          <View className="p-4">
            <Text className="text-red-500 text-center">{error}</Text>
            <TouchableOpacity 
              className="bg-[#4CAF50] px-4 py-2 rounded-lg mt-2"
              onPress={() => loadHistory(0)}
            >
              <Text className="text-white text-center">Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 