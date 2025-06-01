import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getPlants, getRecentPlants } from '../services/plant';
import type { Plant } from '../services/plant';
import { useRefresh } from '../context/RefreshContext';

interface PlantListProps {
  title: string;
  subtitle: string;
  limit?: number;
  showPagination?: boolean;
}

const { width } = Dimensions.get('window');

const PlantList: React.FC<PlantListProps> = ({
  title,
  subtitle,
  limit,
  showPagination = false
}) => {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPlants, setTotalPlants] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { shouldRefresh, setShouldRefresh } = useRefresh();

  useEffect(() => {
    loadPlants();
  }, [currentPage, shouldRefresh]);

  useEffect(() => {
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  const loadPlants = async () => {
    try {
      setLoading(true);
      if (limit) {
        const recentPlants = await getRecentPlants();
        setPlants(recentPlants);
        const fullResponse = await getPlants(0);
        setTotalPlants(fullResponse.totalElements);
        setTotalPages(fullResponse.totalPages);
      } else {
        const response = await getPlants(currentPage);
        setPlants(response.content);
        setTotalPlants(response.totalElements);
        setTotalPages(response.totalPages);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error loading plants:', err);
      setError(err.message || 'Failed to load plants');
    } finally {
      setLoading(false);
    }
  };

  const renderPaginationBar = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    return (
      <View className="flex-row justify-center items-center py-4 bg-white rounded-xl shadow-sm mx-4 mb-4">
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === 0 ? 'bg-gray-100' : 'bg-[#4CAF50]/10'
          }`}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentPage === 0 ? '#9CA3AF' : '#4CAF50'} 
          />
        </TouchableOpacity>

        {startPage > 0 && (
          <>
            <TouchableOpacity
              onPress={() => setCurrentPage(0)}
              className="px-4 py-2 mx-1 rounded-lg bg-[#4CAF50]/10"
            >
              <Text className="text-[#4CAF50] font-medium">1</Text>
            </TouchableOpacity>
            {startPage > 1 && (
              <Text className="px-2 text-gray-400">•••</Text>
            )}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            className={`px-4 py-2 mx-1 rounded-lg ${
              currentPage === page ? 'bg-[#4CAF50]' : 'bg-[#4CAF50]/10'
            }`}
          >
            <Text className={`font-medium ${
              currentPage === page ? 'text-white' : 'text-[#4CAF50]'
            }`}>
              {page + 1}
            </Text>
          </TouchableOpacity>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && (
              <Text className="px-2 text-gray-400">•••</Text>
            )}
            <TouchableOpacity
              onPress={() => setCurrentPage(totalPages - 1)}
              className="px-4 py-2 mx-1 rounded-lg bg-[#4CAF50]/10"
            >
              <Text className="text-[#4CAF50] font-medium">{totalPages}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === totalPages - 1 ? 'bg-gray-100' : 'bg-[#4CAF50]/10'
          }`}
        >
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={currentPage === totalPages - 1 ? '#9CA3AF' : '#4CAF50'} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-[#4CAF50] px-4 py-2 rounded-lg"
          onPress={() => {
            setCurrentPage(0);
            loadPlants();
          }}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="px-6 mb-4">
          <View>
            <Text className="text-2xl font-bold text-[#2B5329]">{title}</Text>
            <Text className="text-gray-600">{subtitle}</Text>
          </View>
        </View>

        <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          {plants.map((plant) => (
            <Link 
              key={plant.id} 
              href={{
                pathname: "/plant/[id]",
                params: { 
                  id: plant.id, 
                  name: plant.name,
                  coverImage: plant.plantCoverUrl
                }
              }}
              asChild
            >
              <TouchableOpacity className="mb-4">
                <View className="flex-row bg-white rounded-2xl overflow-hidden shadow-sm">
                  <View className="w-32 h-32 relative">
                    {plant.plantCoverUrl ? (
                      <Image
                        source={{ uri: plant.plantCoverUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full bg-gray-100 items-center justify-center">
                        <Text className="text-gray-500 text-sm text-center px-2">Choose Avatar</Text>
                      </View>
                    )}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      className="absolute bottom-0 left-0 right-0 h-16"
                    />
                    <View className="absolute bottom-2 left-2 right-2">
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#4CAF50] mr-2" />
                        <Text className="text-white text-sm font-medium">
                          {plant.name || 'Unnamed Plant'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="flex-1 p-4">
                    <Text className="text-lg font-semibold text-[#2B5329]">
                      {plant.name || 'Unnamed Plant'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}

          {limit && totalPlants > limit && !showPagination && (
            <TouchableOpacity 
              onPress={() => router.push('/plants')}
              className="bg-[#4CAF50]/10 py-3 rounded-xl mb-4"
            >
              <Text className="text-[#4CAF50] text-center font-semibold">
                View All {totalPlants} Plants
              </Text>
            </TouchableOpacity>
          )}

          {showPagination && renderPaginationBar()}
        </View>
      </ScrollView>
    </View>
  );
};

export default PlantList; 