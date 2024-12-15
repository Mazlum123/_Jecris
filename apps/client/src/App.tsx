import React from 'react';
import { AppRouter } from './routes';
import { ToastContainer } from './components/common/Toast';
import './styles/main.scss';

const App = () => {
  return (
    <div className="app">
      <AppRouter />
      <ToastContainer />
    </div>
  );
};

export default App;