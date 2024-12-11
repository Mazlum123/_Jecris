// apps/client/src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Toast } from '../common/Toast';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  // Validation du mot de passe
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
    setIsLoading(true);

    const validation = validatePassword();

    if (!validation.length || !validation.number || !validation.special) {
      setToast({
        message: 'Password does not meet requirements',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    if (!validation.match) {
      setToast({
        message: 'Passwords do not match',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setToast({
        message: 'Please accept the terms and conditions',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      setToast({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setToast({ 
        message: error instanceof Error ? error.message : 'Registration failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requirements = validatePassword();

  return (
    <>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            disabled={isLoading}
          />
           <div className="password-requirements">
            <ul>
              <li className={requirements.length ? 'valid' : ''}>
                At least 8 characters long
              </li>
              <li className={requirements.number ? 'valid' : ''}>
                Contains at least one number
              </li>
              <li className={requirements.special ? 'valid' : ''}>
                Contains at least one special character
              </li>
              <li className={requirements.match ? 'valid' : ''}>
                Passwords match
              </li>
            </ul>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
          />
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="terms">
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>
          </label>
        </div>

        <button 
          type="submit" 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || !acceptTerms}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="switch-form-button"
              onClick={() => navigate('/auth/login')}
              disabled={isLoading}
            >
              Log in
            </button>
          </p>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};