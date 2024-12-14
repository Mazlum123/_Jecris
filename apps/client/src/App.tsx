import { useEffect, useState } from 'react';
import { AppRouter } from './routes';
import { useAuthStore } from './store/authStore';
import { Toast } from './components/common/Toast';
import './styles/main.scss';

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        setToast({
          message: 'Erreur de connexion',
          type: 'error'
        });
      }
    };

    initAuth();
  }, [checkAuth]);

  return (
    <div className="app">
      <AppRouter />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;