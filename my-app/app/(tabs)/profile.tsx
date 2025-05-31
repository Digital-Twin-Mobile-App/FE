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
            colors={['#4CAF50']}
          />
        }
      >
        <Animated.View 
          className="relative"
          style={{ height: headerHeight }}
        >
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            className="w-full h-full"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          
          <Animated.View 
            className="absolute bottom-0 left-0 right-0 items-center pb-4"
            style={{
              transform: [
                { scale: avatarScale },
                { translateY: avatarTranslateY }
              ]
            }}
          >
            <TouchableOpacity 
              className="relative"
              onPress={() => setShowFullImage(true)}
            >
              <View className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
                <Image
                  source={{ uri: userInfo.avatarUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity 
                className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-white items-center justify-center border-2 border-[#4CAF50] shadow-lg"
                onPress={() => setShowImageOptions(true)}
              >
                <Ionicons name="camera" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </TouchableOpacity>
            <Text className="text-white text-4xl font-bold mt-3 tracking-wide">{`${userInfo.firstName} ${userInfo.lastName}`}</Text>
            <Text className="text-white/90 text-base mt-1">{userInfo.email}</Text>
          </Animated.View>
        </Animated.View>

        <View className="px-4 py-4">
          <View className="flex-row justify-between bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <View className="w-12 h-12 rounded-full bg-[#4CAF50]/10 items-center justify-center mb-2">
                  <Ionicons name={stat.icon} size={24} color="#4CAF50" />
                </View>
                <Text className="text-xl font-bold text-[#2B5329]">{stat.value}</Text>
                <Text className="text-gray-600 text-sm">{stat.label}</Text>
              </View>
            ))}
          </View>

          <View className="mt-4 space-y-3">
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                className="flex-row items-center bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg active:scale-[0.98]"
                onPress={item.onPress}
              >
                <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: `${item.color}20` }}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text className="text-gray-800 text-base flex-1 font-medium">{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            className="mt-4 flex-row items-center justify-center bg-red-50 rounded-xl p-4 shadow-lg active:scale-[0.98]"
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#EF4444" />
            <Text className="text-red-500 text-base font-medium ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View className="mt-auto bg-white rounded-t-3xl">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-center">Change Profile Photo</Text>
            </View>
            <TouchableOpacity 
              className="p-4 flex-row items-center justify-center border-b border-gray-200"
              onPress={() => handleImagePick(true)}
            >
              <Ionicons name="camera" size={24} color="#4CAF50" className="mr-2" />
              <Text className="text-lg ml-2">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-4 flex-row items-center justify-center"
              onPress={() => handleImagePick(false)}
            >
              <Ionicons name="images" size={24} color="#4CAF50" className="mr-2" />
              <Text className="text-lg ml-2">Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-4 border-t border-gray-200"
              onPress={() => setShowImageOptions(false)}
            >
              <Text className="text-red-500 text-lg text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Full Image Modal */}
      <Modal
        visible={showFullImage}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullImage(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/90 items-center justify-center"
          activeOpacity={1}
          onPress={() => setShowFullImage(false)}
        >
          <Image
            source={{ uri: userInfo.avatarUrl }}
            className="w-screen h-screen"
            resizeMode="contain"
          />
          <TouchableOpacity 
            className="absolute top-12 right-6"
            onPress={() => setShowFullImage(false)}
          >
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
