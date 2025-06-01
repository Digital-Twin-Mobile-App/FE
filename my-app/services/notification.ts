import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://c35c-171-243-49-189.ngrok-free.app';
const MAX_RETRIES = 3;

const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  imageUrl: string | null;
  read: boolean;
  actionUrl: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string;
  };
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getUnreadCount = async (): Promise<number> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    console.log('Fetching unread notifications count...');
    const response = await fetchWithRetry(`${API_URL}/notifications/count/unread`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch unread count: ${response.status} ${responseText}`);
    }

    try {
      return parseInt(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in getUnreadCount:', error);
    throw error;
  }
};

export const getNotificationsByType = async (type: string): Promise<PaginatedResponse<Notification>> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    console.log('Fetching notifications by type:', type);
    const response = await fetchWithRetry(`${API_URL}/notifications/by-type?type=${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status} ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in getNotificationsByType:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    console.log('Fetching unread notifications...');
    const response = await fetchWithRetry(`${API_URL}/notifications/unread`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch unread notifications: ${response.status} ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in getUnreadNotifications:', error);
    throw error;
  }
};

export const markAllAsRead = async (): Promise<void> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    console.log('Marking all notifications as read...');
    const response = await fetchWithRetry(`${API_URL}/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to mark notifications as read: ${response.status} ${responseText}`);
    }
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    throw error;
  }
}; 