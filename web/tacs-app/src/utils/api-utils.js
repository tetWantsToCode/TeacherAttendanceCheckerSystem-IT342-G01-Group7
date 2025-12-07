import axios from 'axios';
import { getCurrentUser } from './auth-utils';

export const API_BASE_URL = 'http://localhost:8080/api';

// Get auth headers for API requests
export function getAuthHeaders() {
  const authData = getCurrentUser();
  const token = authData?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Create axios instance with auth
export function createAuthAxios() {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  });

  // Add interceptor to refresh headers on each request
  instance.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      ...getAuthHeaders()
    };
    return config;
  });

  return instance;
}

// Generic API call wrapper with error handling
export async function apiCall(method, endpoint, data = null, customConfig = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...customConfig.headers
      },
      ...customConfig
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    console.error('Error response:', error.response);
    console.error('Error config:', error.config);
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred';
    return { success: false, error: errorMessage, details: error.response?.data };
  }
}

// Convenience methods
export const api = {
  get: (endpoint, config) => apiCall('GET', endpoint, null, config),
  post: (endpoint, data, config) => apiCall('POST', endpoint, data, config),
  put: (endpoint, data, config) => apiCall('PUT', endpoint, data, config),
  delete: (endpoint, config) => apiCall('DELETE', endpoint, null, config),
};

// Common fetch patterns
export async function fetchWithAuth(endpoint) {
  return api.get(endpoint);
}

export async function postWithAuth(endpoint, data) {
  return api.post(endpoint, data);
}

export async function putWithAuth(endpoint, data) {
  return api.put(endpoint, data);
}

export async function deleteWithAuth(endpoint) {
  return api.delete(endpoint);
}
