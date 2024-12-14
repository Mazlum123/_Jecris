import { vi } from 'vitest';

export const mockAuthStore = {
  isAuthenticated: false,
  user: null,
  token: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn()
};

export const useAuthStore = vi.fn((selector) => selector(mockAuthStore));