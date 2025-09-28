import axios from 'axios';

// Hardcoded to fix caching issue - force port 5001
const API_BASE_URL = 'http://localhost:5001/api';

// Force cache busting - this will help debug
console.log('API Client initialized with URL:', API_BASE_URL);
console.log('API Client initialized at:', new Date().toISOString());
console.log('CACHE BUST TIMESTAMP:', Date.now());

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  console.log('Making API request to:', config.baseURL + config.url);
  console.log('Request method:', config.method);
  console.log('Request data:', config.data);
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    console.error('Error config:', error.config);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;