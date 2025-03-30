import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Plant {
  id: string;
  name: string;
  image: string;
  type: string;
  watering: string;
  health: string;
  isFavorite: boolean;
}

interface PlantListProps {
  plants: Plant[];
  title: string;
  subtitle: string;
  showWateringStatus?: boolean;
  hideAddButton?: boolean;
}

const { width } = Dimensions.get('window');

const PlantList: React.FC<PlantListProps> = ({
  plants,
  title,
  subtitle,
  showWateringStatus = false,
  hideAddButton = false
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = useState('all');

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const categories = [
    { id: 'all', name: 'All Plants' },
    { id: 'indoor', name: 'Indoor' },
    { id: 'outdoor', name: 'Outdoor' },
    { id: 'favorites', name: 'Favorites' },
  ];

  const filteredPlants = plants.filter(plant => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'indoor') return plant.type === 'Indoor';
    if (selectedCategory === 'outdoor') return plant.type === 'Outdoor';
    if (selectedCategory === 'favorites') return plant.isFavorite;
    return true;
  });

  return (
    <View className="flex-1">
      <Animated.View 
        style={{
          transform: [
            { scale: headerScale },
            { translateY: headerTranslateY }
          ]
        }}
        className="px-5 pt-4 pb-2"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-[#2B5329]">{title}</Text>
            <Text className="text-gray-600">{subtitle}</Text>
          </View>
          {!hideAddButton && (
            <Link href="/add-plant" asChild>
              <TouchableOpacity className="w-10 h-10 bg-[#4CAF50] rounded-full items-center justify-center">
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </Link>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          <View className="flex-row space-x-3">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category.id 
                    ? 'bg-[#4CAF50]' 
                    : 'bg-gray-100'
                }`}
              >
                <Text className={`font-medium ${
                  selectedCategory === category.id 
                    ? 'text-white' 
                    : 'text-gray-600'
                }`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      <Animated.ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View className="space-y-4">
          {filteredPlants.map((plant, index) => (
            <Link 
              key={plant.id} 
              href={{ pathname: "/plant/[id]", params: { id: plant.id } }} 
              asChild
            >
              <TouchableOpacity 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98]"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row">
                  <View className="w-32 h-32 relative">
                    <Image
                      source={{ uri: plant.image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      className="absolute bottom-0 left-0 right-0 h-16"
                    />
                    <View className="absolute bottom-2 left-2 right-2">
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#4CAF50] mr-2" />
                        <Text className="text-white text-sm font-medium">{plant.type}</Text>
                      </View>
                    </View>
                    <View className="absolute top-2 right-2">
                      <BlurView intensity={20} className="rounded-full overflow-hidden">
                        <TouchableOpacity 
                          className="w-8 h-8 items-center justify-center"
                          onPress={() => {}}
                        >
                          <Ionicons 
                            name={plant.isFavorite ? "heart" : "heart-outline"} 
                            size={18} 
                            color={plant.isFavorite ? "#4CAF50" : "#9E9E9E"} 
                          />
                        </TouchableOpacity>
                      </BlurView>
                    </View>
                  </View>
                  
                  <View className="flex-1 p-4">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-[#2B5329]">{plant.name}</Text>
                        <View className="flex-row items-center mt-1">
                          <View className="w-6 h-6 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-2">
                            <Ionicons name="water" size={14} color="#4CAF50" />
                          </View>
                          <Text className="text-gray-600">{plant.watering}</Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center mt-3">
                      <View className={`px-3 py-1 rounded-full ${
                        plant.health === 'Excellent' ? 'bg-green-100' :
                        plant.health === 'Healthy' ? 'bg-blue-100' :
                        'bg-yellow-100'
                      }`}>
                        <View className="flex-row items-center">
                          <Ionicons 
                            name={
                              plant.health === 'Excellent' ? 'checkmark-circle' :
                              plant.health === 'Healthy' ? 'leaf' :
                              'warning'
                            }
                            size={12}
                            color={
                              plant.health === 'Excellent' ? '#059669' :
                              plant.health === 'Healthy' ? '#3B82F6' :
                              '#D97706'
                            }
                            className="mr-1"
                          />
                          <Text className={`text-xs font-medium ${
                            plant.health === 'Excellent' ? 'text-green-700' :
                            plant.health === 'Healthy' ? 'text-blue-700' :
                            'text-yellow-700'
                          }`}>
                            {plant.health}
                          </Text>
                        </View>
                      </View>
                      {showWateringStatus && (
                        <View className="ml-2 px-3 py-1 rounded-full bg-orange-100">
                          <View className="flex-row items-center">
                            <Ionicons name="water" size={12} color="#D97706" className="mr-1" />
                            <Text className="text-xs font-medium text-orange-700">
                              Needs Water
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default PlantList; 