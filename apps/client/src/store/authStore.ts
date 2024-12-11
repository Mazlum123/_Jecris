import { create } from 'zustand';
import { AuthState } from '../types/auth';
import { authService } from '../services/auth.service';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;

      localStorage.setItem('token', token);

      set({
        user,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register(name, email, password);
      const { user, token } = response.data;

      localStorage.setItem('token', token);

      set({
        user,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Fonction pour vérifier l'état de l'authentification au chargement de l'app
  checkAuth: async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        set({
          user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));