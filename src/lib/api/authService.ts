import apiClient from './client';

interface LoginResponse {
  success: boolean;
  message: string;
  user: any;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  graduationYear: number;
  degree: string;
  department: string;
  rollNo?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('Auth service login - API Base URL:', apiClient.defaults.baseURL);
    console.log('Auth service login - Full URL:', `${apiClient.defaults.baseURL}/auth/login`);
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<any> {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};