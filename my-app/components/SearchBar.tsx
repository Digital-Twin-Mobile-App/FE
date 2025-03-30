import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSubmit }) => {
  return (
    <View className="relative">
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <View className="flex-row items-center px-4 py-3">
          <View className="w-10 h-10 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-2">
            <Ionicons name="search" size={20} color="#4CAF50" />
          </View>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder="Search plants..."
            placeholderTextColor="#9E9E9E"
            className="flex-1 text-base text-gray-800"
          />
          {value.length > 0 && (
            <TouchableOpacity 
              onPress={() => onChangeText('')}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="close-circle" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchBar; 