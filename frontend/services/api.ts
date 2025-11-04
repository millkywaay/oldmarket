
import { API_BASE_URL } from '../constants';

interface RequestOptions extends RequestInit {
  data?: any; // For POST, PUT requests
  token?: string | null;
}

async function apiService<T,>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, token, ...customConfig } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET', // Default method based on data presence
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    // For 204 No Content or similar, might not have JSON body
    if (response.status === 204) {
        return undefined as T; // Or handle as needed
    }

    return await response.json() as T;
  } catch (error: any) {
    console.error('API service error:', error);
    throw error; // Re-throw to be caught by calling function
  }
}

export default apiService;
