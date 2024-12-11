import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Cart from '../Cart/Cart';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Cart />
    </div>
  );
}