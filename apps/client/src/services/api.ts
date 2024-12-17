import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { setupCache } from 'axios-cache-adapter';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  response => response,
  error => {
    if (!error.response) {
      return Promise.reject(new Error('Erreur de connexion au serveur'));
    }

    switch (error.response.status) {
      case 401:
        // Redirection vers login si non authentifié
        window.location.href = '/auth/login';
        return Promise.reject(new Error('Session expirée'));
      
      case 403:
        return Promise.reject(new Error('Accès non autorisé'));
      
      case 404:
        return Promise.reject(new Error('Ressource non trouvée'));
      
      case 500:
        return Promise.reject(new Error('Erreur serveur'));
      
      default:
        return Promise.reject(error);
    }
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

// Optimisation des requêtes API 

const cache = setupCache({
  maxAge: 15 * 60 * 1000, // Cache de 15 minutes
  exclude: {
    query: false,
    paths: [/\/auth\/.*/, /\/checkout\/.*/] // Exclure les routes d'auth et de paiement
  }
});

export const api = axios.create({
  adapter: cache.adapter,
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true
});