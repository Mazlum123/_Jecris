import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.scss';
import { lazy, Suspense } from 'react';


// Chargement différé des composants lourds
const Cart = lazy(() => import('./components/Cart/Cart'));
const Library = lazy(() => import('./pages/Library'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* ... */}
    </Suspense>
  );
}

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}