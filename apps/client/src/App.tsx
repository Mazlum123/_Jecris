import React from 'react';
import { AppRouter } from './routes';
import { ToastContainer } from './components/common/Toast';
import './styles/main.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* Composants globaux */}
      <ToastContainer />
      {/* Router pour gérer les pages */}
      <AppRouter />
    </div>
  );
};

export default App;