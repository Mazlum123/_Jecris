import { ReactNode } from 'react';
import Logo from '../../assets/logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <img src={Logo} alt="JeCris Logo" className="auth-logo" />
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};