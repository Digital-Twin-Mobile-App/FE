import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://c35c-171-243-49-189.ngrok-free.app';
const MAX_RETRIES = 3;

export interface Plant {
  id: string;
  name: string;
  plantCoverUrl?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  plantStage?: string | null;
  detectedSpecies?: string | null;
  type?: string;
  wateringSchedule?: string;
  healthStatus?: string;
  location?: string;
  latestData?: {
    height?: number;
    leafCount?: number;
    healthScore?: number;
    lastWatered?: string;
    lastFertilized?: string;
    temperature?: number;
    humidity?: number;
    lightLevel?: number;
    soilMoisture?: number;
  };
}

export interface PlantHistory {
  imageId: string;
  plantId: string;
  mediaTitle: string;
  mediaUrl: string;
  uploaderId: string;
  uploaderName: string;
  uploadDate: string;
  plantStage: string | null;
  stageConfidence: number | null;
  detectedSpecies: string | null;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

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

export const getRecentPlants = async (): Promise<Plant[]> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetchWithRetry(`${API_URL}/plants/my-uploads?page=0`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // Get the last 5 plants by slicing from the end of the array
  return data.content.slice(-5).reverse();
};

export const getPlants = async (page: number = 0): Promise<PaginatedResponse<Plant>> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetchWithRetry(`${API_URL}/plants/my-uploads?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

export const createPlant = async (name: string, image: { uri: string; type: string; name: string }): Promise<Plant> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Creating plant with data:', {
    name,
    imageUri: image.uri,
    imageType: image.type,
    imageName: image.name
  });

  const formData = new FormData();
  const imageFile = {
    uri: image.uri,
    type: image.type,
    name: image.name
  };
  console.log('Image file object:', imageFile);
  
  formData.append('image', imageFile as any);
  formData.append('name', name);

  try {
    console.log('Sending request to:', `${API_URL}/plants/create`);
    console.log('Request headers:', {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });
    console.log('FormData contents:', {
      name: name,
      image: imageFile
    });

    const response = await fetchWithRetry(`${API_URL}/plants/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error response data:', errorData);
      throw new Error(errorData?.message || `Failed to create plant: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Success response data:', responseData);
    return responseData;
  } catch (error: any) {
    console.error('Error creating plant:', error);
    throw new Error(error.message || 'Failed to create plant. Please try again.');
  }
};

export const getPlantDetails = async (plantId: string): Promise<Plant> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Fetching plant details for ID:', plantId);
  try {
    const response = await fetchWithRetry(`${API_URL}/plants/latest?plantId=${plantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch plant details: ${response.status} ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!responseText) {
      // Return null for plantStage and detectedSpecies if no response
      return {
        id: plantId,
        name: 'Unnamed Plant',
        plantStage: null,
        detectedSpecies: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed plant details:', data);

      // Format the response data
      const formattedData: Plant = {
        id: data.id || plantId,
        name: data.name || 'Unnamed Plant',
        plantCoverUrl: data.plantCoverUrl,
        mediaUrl: data.mediaUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        plantStage: data.plantStage || null,
        detectedSpecies: data.detectedSpecies || null,
        latestData: {
          height: data.height,
          leafCount: data.leafCount,
          healthScore: data.healthScore,
          lastWatered: data.lastWatered,
          lastFertilized: data.lastFertilized,
          temperature: data.temperature,
          humidity: data.humidity,
          lightLevel: data.lightLevel,
          soilMoisture: data.soilMoisture
        }
      };

      return formattedData;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Return null for plantStage and detectedSpecies if parse error
      return {
        id: plantId,
        name: 'Unnamed Plant',
        plantStage: null,
        detectedSpecies: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  } catch (error: any) {
    console.error('Error in getPlantDetails:', error);
    // Return null for plantStage and detectedSpecies if any error
    return {
      id: plantId,
      name: 'Unnamed Plant',
      plantStage: null,
      detectedSpecies: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

export const getPlantHistory = async (plantId: string, page: number = 0): Promise<PaginatedResponse<PlantHistory>> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    console.log('Fetching plant history...');
    const response = await fetch(`${API_URL}/plants/history?plantId=${plantId}&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch plant history: ${response.status} ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in getPlantHistory:', error);
    throw error;
  }
};

export const uploadPlantImage = async (plantId: string, image: { uri: string; type: string; name: string }): Promise<void> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    console.error('No token found for upload');
    throw new Error('No token found');
  }

  try {
    console.log('Starting image upload process...');
    console.log('Upload parameters:', {
      plantId,
      imageUri: image.uri,
      imageType: image.type,
      imageName: image.name
    });

    const formData = new FormData();
    const imageFile = {
      uri: image.uri,
      type: image.type,
      name: image.name
    };
    console.log('Preparing FormData with image file:', imageFile);
    
    formData.append('image', imageFile as any);
    formData.append('plantId', plantId);

    console.log('Sending upload request to:', `${API_URL}/plants/upload`);
    console.log('Request headers:', {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });

    const response = await fetchWithRetry(`${API_URL}/plants/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
      console.error('Error response:', responseText);
      throw new Error(`Failed to upload image: ${response.status} ${responseText}`);
    }

    console.log('Image upload completed successfully');
  } catch (error) {
    console.error('Error in uploadPlantImage:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    throw error;
  }
}; 