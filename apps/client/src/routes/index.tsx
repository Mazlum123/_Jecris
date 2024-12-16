import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthPage } from '../pages/AuthPage';
import { Dashboard } from '../pages/Dashboard';
import Layout from '../components/Layout/Layout';
import { Library } from '../pages/Library';
import { CheckoutSuccess } from '../pages/CheckoutSuccess';

// Création du router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'auth/*',
        element: <AuthPage />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'library',
        element: <Library />
      },
      {
        path: 'checkout/success',
        element: <CheckoutSuccess />
      }
    ]
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
