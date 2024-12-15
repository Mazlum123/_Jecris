import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthPage } from '../pages/AuthPage';
import { Dashboard } from '../pages/Dashboard';
import Layout from '../components/Layout/Layout';
import { CheckoutSuccess } from '../pages/CheckoutSuccess';
import { Library } from '../pages/Library';
import PrivateRoute from '@/components/PrivateRoute/PrivateRoute';

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
        path: 'checkout/success',
        element: <CheckoutSuccess />
      },
      {
        path: 'library',
        element: (
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        )
      }
    ]
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};