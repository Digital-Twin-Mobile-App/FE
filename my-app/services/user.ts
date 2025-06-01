import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://c35c-171-243-49-189.ngrok-free.app'

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
  const token = await AsyncStorage.getItem('userToken');
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
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  // Validate required fields
  if (!userData.firstName?.trim()) {
    throw new Error('First name is required');
  }
  if (!userData.lastName?.trim()) {
    throw new Error('Last name is required');
  }

  const formData = new FormData();
  
  // Always append firstName and lastName since they are required
  formData.append('firstName', userData.firstName.trim());
  formData.append('lastName', userData.lastName.trim());

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

  try {
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
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to update user info. Please try again later.');
  }
};

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string;
}

export const getUserProfile = async (): Promise<User> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    console.log('Fetching user profile...');
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status} ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}; 