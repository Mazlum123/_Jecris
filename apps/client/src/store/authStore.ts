import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';
import { login as loginApi, register as registerApi } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await loginApi(email, password);
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true
          });
        } catch (error) {
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await registerApi(name, email, password);
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('auth-storage');
          if (!token) {
            set({ user: null, token: null, isAuthenticated: false });
            return;
          }
          // Ici vous pouvez ajouter une vérification du token avec le backend
          // Pour l'instant, nous supposons que le token est valide
          set({ isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);