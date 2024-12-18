import { AuthResponse } from '../types/auth';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const { token } = response.data.data;
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    const { token } = response.data.data;
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
    delete api.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const checkAuth = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

const handleAuthError = (error: any): Error => {
  if (error.response) {
    const message = error.response.data.message || 'Authentication failed';
    return new Error(message);
  }
  return new Error('Network error');
};