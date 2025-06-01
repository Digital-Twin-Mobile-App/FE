import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, Dimensions, Alert, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { logout } from '../../services/auth';
import { getUserInfo } from '../../services/user';

const { width } = Dimensions.get('window');

type IconName = keyof typeof Ionicons.glyphMap;

interface Stat {
  label: string;
  value: string;
  icon: IconName;
}

interface MenuItem {
  icon: IconName;
  label: string;
  color: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: 'https://i.pravatar.cc/300',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [280, 120],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  const avatarTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 30],
    extrapolate: 'clamp',
  });

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const info = await getUserInfo();
      setUserInfo({
        firstName: info.firstName || '',
        lastName: info.lastName || '',
        email: info.email || '',
        avatarUrl: info.avatarUrl || 'https://i.pravatar.cc/300',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load user info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleImagePick = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        router.push({
          pathname: '/edit-profile',
          params: { newAvatarUri: result.assets[0].uri }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setShowImageOptions(false);
    }
  };

  const stats: Stat[] = [
    { label: 'Plants', value: '12', icon: 'leaf' },
    { label: 'Farms', value: '3', icon: 'home' },
    { label: 'Favorites', value: '5', icon: 'heart' },
    { label: 'Watering', value: '3', icon: 'water' },
  ];

  const menuItems: MenuItem[] = [
    { 
      icon: 'person', 
      label: 'Edit Profile', 
      color: '#4CAF50',
      onPress: () => router.push('/edit-profile')
    },
    { 
      icon: 'notifications', 
      label: 'Notifications', 
      color: '#2196F3',
      onPress: () => router.push('/notifications')
    },
    { 
      icon: 'settings', 
      label: 'Settings', 
      color: '#FF9800',
      onPress: () => router.push('/settings')
    },
    { 
      icon: 'help-circle', 
      label: 'Help & Support', 
      color: '#9C27B0',
      onPress: () => Alert.alert('Help & Support', 'Need help? Contact us at support@example.com')
    },
    { 
      icon: 'information-circle', 
      label: 'About', 
      color: '#607D8B',
      onPress: () => Alert.alert('About', 'Plant Care App v1.0.0\n\nYour personal plant management companion.')
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUserInfo();
    setIsRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />

      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#4CAF50"
          />
        }
      >
        <Animated.View style={{ height: headerHeight }} className="bg-green-500">
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            className="flex-1"
          >
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity
                onPress={() => setShowImageOptions(true)}
                className="relative"
              >
                <Animated.Image
                  source={{ uri: userInfo.avatarUrl }}
                  className="w-32 h-32 rounded-full border-4 border-white"
                  style={{
                    transform: [
                      { scale: avatarScale },
                      { translateY: avatarTranslateY }
                    ]
                  }}
                />
                <View className="absolute bottom-0 right-0 bg-white rounded-full p-2">
                  <Ionicons name="camera" size={20} color="#4CAF50" />
                </View>
              </TouchableOpacity>
              <Text className="text-white text-2xl font-bold mt-4">
                {userInfo.firstName} {userInfo.lastName}
              </Text>
              <Text className="text-white/80 text-base mt-1">
                {userInfo.email}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View className="px-4 py-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
            >
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: item.color + '20' }}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text className="text-gray-800 text-lg ml-4 flex-1">{item.label}</Text>
              <Ionicons name="chevron-forward" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-50 p-4 rounded-xl mt-4 shadow-sm"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center bg-red-100">
              <Ionicons name="log-out" size={24} color="#EF5350" />
            </View>
            <Text className="text-red-500 text-lg ml-4 flex-1">Logout</Text>
            <Ionicons name="chevron-forward" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      <Modal
        visible={showImageOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 items-center justify-center"
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <BlurView intensity={20} className="w-4/5 rounded-2xl overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-200"
              onPress={() => handleImagePick(true)}
            >
              <Ionicons name="camera" size={24} color="#4CAF50" />
              <Text className="text-gray-800 text-lg ml-4">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={() => handleImagePick(false)}
            >
              <Ionicons name="images" size={24} color="#4CAF50" />
              <Text className="text-gray-800 text-lg ml-4">Choose from Library</Text>
            </TouchableOpacity>
          </BlurView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
