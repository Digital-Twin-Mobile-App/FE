// app/onboarding.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  { id: '1', title: 'Chào mừng đến với Plantypheno', description: 'Ứng dụng thông minh giúp bạn theo dõi và phân tích tình trạng cây trồng dễ dàng.', image: require('../assets/images/onboarding1.png'), gradient: ['#4CAF50', '#2E7D32'] },
  { id: '2', title: 'Chụp ảnh cây trồng', description: 'Chụp ảnh hoặc video cây trồng của bạn để phân tích sức khỏe.', image: require('../assets/images/onboarding2.png'), gradient: ['#2E7D32', '#1B5E20'] },
  { id: '3', title: 'Phân tích thông minh', description: 'Nhận kết quả phân tích chi tiết và khuyến nghị chăm sóc từ AI.', image: require('../assets/images/onboarding3.png'), gradient: ['#1B5E20', '#0A280E'] },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
        {slides.map(slide => (
          <LinearGradient
            key={slide.id}
            colors={['#A8E6CF', '#56AB2F'] as [string, string]}
            style={{ width, height }}
            className="flex-1 justify-center items-center p-6"
          >
            <View className="items-center bg-white/20 rounded-full mb-8" style={{ width: width * 0.6, height: width * 0.6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }}>
              <Image source={slide.image} className="w-full h-full" resizeMode="contain" />
            </View>
            <Text className="text-4xl font-extrabold text-white text-center mb-4">{slide.title}</Text>
            <Text className="text-lg text-white/90 text-center mb-8">{slide.description}</Text>
            <View className="w-full items-center space-y-4 mb-12">
              {['Phân tích AI chính xác', 'Khuyến nghị chăm sóc', 'Theo dõi tiến độ'].map((label, idx) => (
                <View key={idx} className="flex-row items-center bg-white/10 px-6 py-2 rounded-xl w-3/4 justify-center">
                  <View className="w-2 h-2 rounded-full bg-white mr-3" />
                  <Text className="text-white text-base font-medium">{label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-5 pb-10">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={handleSkip}><Text className="text-white text-lg font-medium">Bỏ qua</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleNext} className="bg-white px-6 py-2 rounded-full shadow-md">
            <Text className="text-green-800 text-lg font-bold">{currentIndex === slides.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center space-x-2">
          {slides.map((_, idx) => (
            <View key={idx} className={`h-2 ${idx === currentIndex ? 'w-6' : 'w-2'} rounded-full bg-white`} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
