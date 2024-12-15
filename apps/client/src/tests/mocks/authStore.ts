import { vi } from 'vitest';

export interface AuthStore {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
    name: string;
  };
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const mockAuthStore: AuthStore = {
  isAuthenticated: false,
  user: null,
  token: null,
  login: vi.fn().mockImplementation(async (email: string, password: string) => {
    if (email === 'test@test.com' && password === 'Password123!') {
      return { user: { id: '1', email, name: 'Test User' }, token: 'fake-token' };
    }
    throw new Error('Invalid credentials');
  }),
  register: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn()
};