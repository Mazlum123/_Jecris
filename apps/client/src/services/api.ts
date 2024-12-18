import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const cache = setupCache({
  maxAge: 15 * 60 * 1000, // Cache de 15 minutes
  exclude: {
    query: false,
    paths: [/\/auth\/.*/, /\/checkout\/.*/], // Exclure certaines routes
  },
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  adapter: cache.adapter,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteurs de requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteurs de réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

api.get('/books')
   .then(response => console.log(response.data))
   .catch(error => console.error(error));
