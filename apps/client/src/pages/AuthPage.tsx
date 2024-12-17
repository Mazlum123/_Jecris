import { useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const AuthPage = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/auth/register';
  const message = location.state?.message;

  return (
    <AuthLayout title={isRegister ? 'Inscription' : 'Connexion'}>
      {message && (
        <div className="auth-message">
          {message}
        </div>
      )}
      {isRegister ? <RegisterForm /> : <LoginForm />}
    </AuthLayout>
  );
};