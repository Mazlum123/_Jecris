import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import { useAuthStore, mockAuthStore } from './mocks/authStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Authentication Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.isAuthenticated = false;
  });

  describe('LoginForm', () => {
    it('handles successful login', async () => {
      mockAuthStore.login.mockResolvedValueOnce({});

      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@test.com' }
      });

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'Password123!' }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

      await waitFor(() => {
        expect(mockAuthStore.login).toHaveBeenCalledWith('test@test.com', 'Password123!');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('displays error message on invalid credentials', async () => {
      mockAuthStore.login.mockRejectedValueOnce(new Error('Identifiants invalides'));

      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'invalid@test.com' }
      });

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'wrong' }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

      await waitFor(() => {
        expect(screen.getByText('Identifiants invalides')).toBeInTheDocument();
      });
    });
  });

  describe('RegisterForm', () => {
    it('handles successful registration', async () => {
      mockAuthStore.register.mockResolvedValueOnce({});

      render(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Nom'), {
        target: { value: 'Test User' }
      });

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'newuser@test.com' }
      });

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'Password123!' }
      });

      fireEvent.change(screen.getByLabelText('Confirmer le mot de passe'), {
        target: { value: 'Password123!' }
      });

      fireEvent.click(screen.getByLabelText('J\'accepte les conditions d\'utilisation'));
      fireEvent.click(screen.getByRole('button', { name: 'S\'inscrire' }));

      await waitFor(() => {
        expect(mockAuthStore.register).toHaveBeenCalledWith(
          'Test User',
          'newuser@test.com',
          'Password123!'
        );
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('validates password requirements', async () => {
      render(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'weak' }
      });

      expect(screen.getByText('Au moins 8 caractères')).toHaveClass('invalid');
      expect(screen.getByText('Au moins un chiffre')).toHaveClass('invalid');
      expect(screen.getByText('Au moins un caractère spécial')).toHaveClass('invalid');

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'StrongPass123!' }
      });

      expect(screen.getByText('Au moins 8 caractères')).toHaveClass('valid');
      expect(screen.getByText('Au moins un chiffre')).toHaveClass('valid');
      expect(screen.getByText('Au moins un caractère spécial')).toHaveClass('valid');
    });

    it('validates matching passwords', async () => {
      render(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'Password123!' }
      });

      fireEvent.change(screen.getByLabelText('Confirmer le mot de passe'), {
        target: { value: 'DifferentPass123!' }
      });

      expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    it('redirects to login when not authenticated', async () => {
      mockAuthStore.isAuthenticated = false;

      render(
        <BrowserRouter>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login', expect.any(Object));
      });
    });

    it('allows access when authenticated', async () => {
      mockAuthStore.isAuthenticated = true;

      render(
        <BrowserRouter>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during login', async () => {
      mockAuthStore.login.mockRejectedValueOnce(new Error('Erreur de connexion'));

      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@test.com' }
      });

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'Password123!' }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

      await waitFor(() => {
        expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
      });
    });

    it('handles server errors during registration', async () => {
      mockAuthStore.register.mockRejectedValueOnce(new Error('Erreur serveur'));

      render(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      );
      fireEvent.change(screen.getByLabelText('Nom'), {
        target: { value: 'Test User' }
      });

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@test.com' }
      });

      fireEvent.change(screen.getByLabelText('Mot de passe'), {
        target: { value: 'Password123!' }
      });

      fireEvent.change(screen.getByLabelText('Confirmer le mot de passe'), {
        target: { value: 'Password123!' }
      });

      fireEvent.click(screen.getByLabelText('J\'accepte les conditions d\'utilisation'));
      fireEvent.click(screen.getByRole('button', { name: 'S\'inscrire' }));

      await waitFor(() => {
        expect(screen.getByText('Erreur serveur')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('validates email format', async () => {
      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'invalid-email' }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

      expect(screen.getByText('Email invalide')).toBeInTheDocument();
    });

    it('requires all fields to be filled', async () => {
      render(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: 'S\'inscrire' }));

      expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
      expect(screen.getByText('L\'email est requis')).toBeInTheDocument();
      expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument();
      expect(screen.getByText('Vous devez accepter les conditions d\'utilisation')).toBeInTheDocument();
    });
  });
});