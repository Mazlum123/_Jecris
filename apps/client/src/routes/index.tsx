import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { Dashboard } from '../pages/Dashboard';
import Home from '../pages/Home';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/*',
    children: [
      {
        path: 'login',
        element: <AuthPage />,
      },
      {
        path: 'register',
        element: <AuthPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};