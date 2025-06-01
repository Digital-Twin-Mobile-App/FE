import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

const API_URL = 'https://c35c-171-243-49-189.ngrok-free.app';

interface LoginResponse {
  code: number;
  result: {
    token: string;
    authenticated: boolean;
    user?: any;
  };
}

interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

const storage: AsyncStorageStatic = AsyncStorage;

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleApiResponse<LoginResponse['result']>(response);
  
  if (data.code === 200 && data.result.authenticated) {
    await AsyncStorage.setItem('userToken', data.result.token);
    if (data.result.user) {
      await AsyncStorage.setItem('userData', JSON.stringify(data.result.user));
    }
    return data as LoginResponse;
  }
  throw new Error(data.message || 'Invalid credentials');
};

export const logout = async (): Promise<void> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ token })
  });

  await handleApiResponse(response);
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userData');
};

export const verifyEmail = async (email: string): Promise<ApiResponse<{ authenticated: boolean }>> => {
  const response = await fetch(`${API_URL}/auth/verifyEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });

  return handleApiResponse<{ authenticated: boolean }>(response);
};

export const verifyOTP = async (email: string, otp: string): Promise<ApiResponse<{ authenticated: boolean }>> => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp })
  });

  return handleApiResponse<{ authenticated: boolean }>(response);
};

export const changePassword = async (
  email: string, 
  newPassword: string, 
  confirmPassword: string
): Promise<ApiResponse<{ token: string; authenticated: boolean }>> => {
  const response = await fetch(`${API_URL}/auth/changePassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, newPassword, confirmPassword })
  });

  const data = await handleApiResponse<{ token: string; authenticated: boolean }>(response);
  
  if (data.code === 200 && data.result.authenticated) {
    await AsyncStorage.setItem('userToken', data.result.token);
  }
  
  return data;
};

export const getUser = async (): Promise<any | null> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) return null;

  const response = await fetch(`${API_URL}/auth/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  const userData = await AsyncStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<ApiResponse<{ token: string; user: any }>> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  await AsyncStorage.setItem('userToken', data.token);
  await AsyncStorage.setItem('userData', JSON.stringify(data.user));
  return data;
}; 