import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Email invalide');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          data-testid="email-input"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          data-testid="password-input"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Votre mot de passe"
          required
        />
      </div>

      {error && <div className="error-message" data-testid="error-message">{error}</div>}

      <button type="submit" className="submit-button">
        Se connecter
      </button>

      <div className="form-footer">
        <button
          type="button"
          className="switch-form-button"
          onClick={() => navigate('/auth/register')}
        >
          S'inscrire
        </button>
      </div>
    </form>
  );
};