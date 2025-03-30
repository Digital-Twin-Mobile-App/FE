import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Mock data for the chart
const growthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    data: [20, 45, 28, 80, 99, 43],
  }],
};

export default function Analytics() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          title: 'Plant Analytics',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView className="flex-1 p-6">
        {/* Growth Chart */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <Text className="text-xl font-semibold text-[#2B5329] mb-4">Growth History</Text>
          <LineChart
            data={growthData}
            width={width - 48}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Statistics Cards */}
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] bg-[#4CAF50]/10 rounded-2xl p-4 mb-4">
            <View className="w-12 h-12 rounded-full bg-[#4CAF50]/20 items-center justify-center mb-3">
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
            </View>
            <Text className="text-2xl font-bold text-[#2B5329]">15%</Text>
            <Text className="text-gray-600">Growth Rate</Text>
          </View>

          <View className="w-[48%] bg-[#2196F3]/10 rounded-2xl p-4 mb-4">
            <View className="w-12 h-12 rounded-full bg-[#2196F3]/20 items-center justify-center mb-3">
              <Ionicons name="water" size={24} color="#2196F3" />
            </View>
            <Text className="text-2xl font-bold text-[#2B5329]">92%</Text>
            <Text className="text-gray-600">Watering Success</Text>
          </View>

          <View className="w-[48%] bg-[#FFC107]/10 rounded-2xl p-4 mb-4">
            <View className="w-12 h-12 rounded-full bg-[#FFC107]/20 items-center justify-center mb-3">
              <Ionicons name="leaf" size={24} color="#FFC107" />
            </View>
            <Text className="text-2xl font-bold text-[#2B5329]">8</Text>
            <Text className="text-gray-600">New Leaves</Text>
          </View>

          <View className="w-[48%] bg-[#9C27B0]/10 rounded-2xl p-4 mb-4">
            <View className="w-12 h-12 rounded-full bg-[#9C27B0]/20 items-center justify-center mb-3">
              <Ionicons name="calendar" size={24} color="#9C27B0" />
            </View>
            <Text className="text-2xl font-bold text-[#2B5329]">30</Text>
            <Text className="text-gray-600">Days Tracked</Text>
          </View>
        </View>

        {/* Recent Activities */}
        <View className="mt-4">
          <Text className="text-xl font-semibold text-[#2B5329] mb-4">Recent Activities</Text>
          <View className="space-y-4">
            {[1, 2, 3].map((item) => (
              <View key={item} className="flex-row items-center bg-gray-50 rounded-xl p-4">
                <View className="w-10 h-10 rounded-full bg-[#4CAF50]/20 items-center justify-center mr-4">
                  <Ionicons name="water" size={20} color="#4CAF50" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-[#2B5329]">Watering Completed</Text>
                  <Text className="text-sm text-gray-600">2 hours ago</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 