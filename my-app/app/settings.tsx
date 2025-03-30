import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Switch, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  action: () => void;
  rightComponent?: React.ReactNode;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const settingsSections: SettingsSection[] = [
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
          title: 'Notifications',
          action: () => setNotifications(!notifications),
          rightComponent: (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={notifications ? '#fff' : '#f4f4f4'}
            />
          ),
        },
        {
          icon: 'moon-outline' as keyof typeof Ionicons.glyphMap,
          title: 'Dark Mode',
          action: () => setDarkMode(!darkMode),
          rightComponent: (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={darkMode ? '#fff' : '#f4f4f4'}
            />
          ),
        },
        {
          icon: 'language-outline' as keyof typeof Ionicons.glyphMap,
          title: 'Language',
          action: () => {},
          rightComponent: (
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-2">{language}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </View>
          ),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
          title: 'Help Center',
          action: () => setShowHelpModal(true),
        },
        {
          icon: 'mail-outline' as keyof typeof Ionicons.glyphMap,
          title: 'Contact Us',
          action: () => setShowContactModal(true),
        },
        {
          icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
          title: 'About',
          action: () => setShowAboutModal(true),
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView className="flex-1">
        <View className="p-6">
          {settingsSections.map((section, index) => (
            <View key={index} className="mb-8">
              <Text className="text-lg font-semibold text-[#2B5329] mb-4">{section.title}</Text>
              <View className="bg-white rounded-xl overflow-hidden border border-gray-100">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    onPress={item.action}
                    className={`flex-row items-center p-4 ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View className="w-10 h-10 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-4">
                      <Ionicons name={item.icon} size={20} color="#4CAF50" />
                    </View>
                    <Text className="flex-1 text-base text-[#2B5329]">{item.title}</Text>
                    {item.rightComponent}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Help Center Modal */}
      <Modal
        visible={showHelpModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">Help Center</Text>
            <TouchableOpacity onPress={() => setShowHelpModal(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1 p-6">
            <Text className="text-lg font-semibold text-[#2B5329] mb-4">Frequently Asked Questions</Text>
            <View className="space-y-4">
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">How do I add a new plant?</Text>
                <Text className="text-gray-600">Go to the Plants tab and tap the + button. Fill in the plant details and save.</Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">How do I set up watering reminders?</Text>
                <Text className="text-gray-600">Navigate to the Watering tab and tap on a plant to set up its watering schedule.</Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">How do I track plant health?</Text>
                <Text className="text-gray-600">Use the Analytics tab to view detailed health metrics and growth tracking.</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Contact Us Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">Contact Us</Text>
            <TouchableOpacity onPress={() => setShowContactModal(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1 p-6">
            <Text className="text-lg font-semibold text-[#2B5329] mb-4">Get in Touch</Text>
            <View className="space-y-4">
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">Email Support</Text>
                <Text className="text-gray-600">support@plantcare.com</Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">Phone Support</Text>
                <Text className="text-gray-600">+1 (555) 123-4567</Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">Office Hours</Text>
                <Text className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">About</Text>
            <TouchableOpacity onPress={() => setShowAboutModal(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1 p-6">
            <Text className="text-lg font-semibold text-[#2B5329] mb-4">About Plant Care</Text>
            <View className="space-y-4">
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">Version</Text>
                <Text className="text-gray-600">1.0.0</Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">Description</Text>
                <Text className="text-gray-600">Plant Care is your personal plant management companion. Track your plants, set watering reminders, and monitor their health all in one place.</Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base font-medium text-[#2B5329] mb-2">Terms of Service</Text>
                <Text className="text-gray-600">By using Plant Care, you agree to our terms of service and privacy policy.</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 