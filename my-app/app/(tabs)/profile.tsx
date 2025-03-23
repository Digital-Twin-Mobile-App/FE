export const options = { headerShown: false };

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform, ActionSheetIOS, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [backgroundUri, setBackgroundUri] = useState<string | null>(null);

  const changeImage = (setter: (uri: string) => void) => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;

    const pick = async (source: 'camera' | 'library') => {
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (!result.canceled && result.assets.length) setter(result.assets[0].uri);
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex }, idx => {
        if (idx === 0) pick('camera');
        else if (idx === 1) pick('library');
      });
    } else {
      Alert.alert('Change Image', '', [
        { text: 'Take Photo', onPress: () => pick('camera') },
        { text: 'Choose from Library', onPress: () => pick('library') },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const info = [
    { label: 'Full Name', value: 'Nguyễn Văn A' },
    { label: 'Phone', value: '+84 123 456 789' },
    { label: 'Location', value: 'Hanoi, Vietnam' },
    { label: 'Bio', value: 'Plant phenotyping enthusiast passionate about sustainable agriculture.' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundUri ? { uri: backgroundUri } : undefined}
        style={styles.header}
        imageStyle={{ opacity: backgroundUri ? 0.5 : 0 }}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => changeImage(setBackgroundUri)} />
        <TouchableOpacity onPress={() => changeImage(setAvatarUri)}>
          {avatarUri
            ? <Avatar.Image size={100} source={{ uri: avatarUri }} />
            : <Avatar.Icon size={100} icon="account-circle" />}
        </TouchableOpacity>
        <Text style={styles.name}>Nguyễn Văn A</Text>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {info.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.logoutButton}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#56AB2F' },
  header: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  name: { marginTop: 8, fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  content: { padding: 16, backgroundColor: '#F0FFF0', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#555' },
  value: { fontSize: 18, fontWeight: '500', color: '#1976D2', marginTop: 4 },
  logoutButton: { marginTop: 24, alignSelf: 'center', backgroundColor: '#FF5252', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 24 },
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
