import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';

export default function Header() {
  const itemCount = useCartStore((state) => state.items.length);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">JeCris</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/add-book">Ajouter un livre</Link></li>
          <li className="cart-count">Panier ({itemCount})</li>
        </ul>
      </nav>
    </header>
  );
}