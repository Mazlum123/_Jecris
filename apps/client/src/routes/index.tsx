import { createBrowserRouter } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import Home from '@pages/Home';
import AddBook from '@pages/AddBook';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'add-book',
        element: <AddBook />
      }
    ]
  }
]);