import { api } from './api';
import { User } from '../types/auth';

interface LoginResponse {
  user: User;
  token: string;
}

interface AuthResponse {
  success: boolean;
  data: LoginResponse;
  message: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<AuthResponse>('/auth/me');
      return response.data.data.user;
    } catch {
      return null;
    }
  },
};