import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://c5af-171-243-49-189.ngrok-free.app'

interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}

interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  dob: string | null;
  avatarUrl: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  avatar?: {
    uri: string;
    type: string;
    name: string;
  };
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/user/myInfo`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data: ApiResponse<UserInfo> = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || 'Failed to get user info');
  }

  if (!data.result) {
    throw new Error('No user data found');
  }

  return data.result;
};

export const updateUserInfo = async (userData: UpdateUserData): Promise<UserInfo> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const formData = new FormData();
  
  if (userData.firstName) {
    formData.append('firstName', userData.firstName);
  }
  
  if (userData.lastName) {
    formData.append('lastName', userData.lastName);
  }

  if (userData.avatar) {
    // Create a file object from the image uri
    const localUri = userData.avatar.uri;
    const filename = localUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri: localUri,
      name: filename,
      type,
    } as any);
  }

  const response = await fetch(`${API_URL}/user/update-user`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type when sending FormData,
      // browser will set it automatically with boundary
    },
    body: formData,
  });

  const data: ApiResponse<UserInfo> = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || 'Failed to update user info');
  }

  if (!data.result) {
    throw new Error('No user data found');
  }

  return data.result;
}; 