import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 (non autorisé) et pas déjà en train de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Déconnexion si le token est invalide
      if (error.response?.data?.message === 'Token expired' || 
          error.response?.data?.message === 'Invalid token') {
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      try {
        // Tentative de rafraîchissement du token
        const response = await api.post('/auth/refresh-token');
        const { token } = response.data;

        // Mise à jour du token dans le store
        useAuthStore.setState({ token });
        
        // Mise à jour du header et réessai de la requête originale
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnexion
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helpers pour la gestion des erreurs
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Erreur de réponse du serveur
    return error.response.data.message || 'Une erreur est survenue';
  } else if (error.request) {
    // Pas de réponse du serveur
    return 'Impossible de contacter le serveur';
  } else {
    // Erreur lors de la configuration de la requête
    return 'Une erreur est survenue';
  }
};

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
}