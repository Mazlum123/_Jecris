import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname === '/auth/register';

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-toggle">
          <button
            className={!isRegisterPage ? 'active' : ''} 
            onClick={() => navigate('/auth/login')}
          >
            Login
          </button>
          <button
            className={isRegisterPage ? 'active' : ''}
            onClick={() => navigate('/auth/register')}
          >
            Register
          </button>
        </div>
        {isRegisterPage ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
};