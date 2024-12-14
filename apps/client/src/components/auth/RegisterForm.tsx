import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const register = useAuthStore(state => state.register);

  const validatePassword = () => {
    const requirements = {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword
    };
    return requirements;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePassword();

    if (!validation.length || !validation.number || !validation.special) {
      setError('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    if (!validation.match) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Nom</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre nom"
        required
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        required
      />

      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Votre mot de passe"
        required
      />

      <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
      <input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmez votre mot de passe"
        required
      />

      <div className="password-requirements">
        <ul>
          <li className={password.length >= 8 ? 'valid' : 'invalid'}>
            Au moins 8 caractères
          </li>
          <li className={/\d/.test(password) ? 'valid' : 'invalid'}>
            Au moins un chiffre
          </li>
          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : 'invalid'}>
            Au moins un caractère spécial
          </li>
          <li className={password === confirmPassword ? 'valid' : 'invalid'}>
            Les mots de passe correspondent
          </li>
        </ul>
      </div>

      <div className="terms-checkbox">
        <input
          id="terms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
        <label htmlFor="terms">
          J'accepte les conditions d'utilisation
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="submit-button">
        S'inscrire
      </button>

      <div className="form-footer">
        <button
          type="button"
          className="switch-form-button"
          onClick={() => navigate('/auth/login')}
        >
          Se connecter
        </button>
      </div>
    </form>
  );
};