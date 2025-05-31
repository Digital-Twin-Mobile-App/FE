import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://4b78-171-243-48-89.ngrok-free.app';

interface LoginResponse {
  code: number;
  result: {
    token: string;
    authenticated: boolean;
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
    await AsyncStorage.setItem('token', data.result.token);
    return data as LoginResponse;
  }
  throw new Error(data.message || 'Invalid credentials');
};

export const logout = async (): Promise<void> => {
  const token = await AsyncStorage.getItem('token');
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
  await AsyncStorage.removeItem('token');
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
    await AsyncStorage.setItem('token', data.result.token);
  }
  
  return data;
}; 