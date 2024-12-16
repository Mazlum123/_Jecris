import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { Cart } from '../Cart/Cart';

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore(state => state.items.length);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">
        <a onClick={() => navigate('/')} className="nav-link">JeCris</a>
      </div>
      <nav>
        <ul>
          <li><a onClick={() => navigate('/')} className="nav-link">Accueil</a></li>
          <li><a onClick={() => navigate('/add-book')} className="nav-link">Ajouter un livre</a></li>
          <li><a onClick={() => navigate('/library')} className="nav-link">Ma bibliothèque</a></li>
          <li>
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              Panier ({itemCount})
            </button>
          </li>
        </ul>
      </nav>
      {isCartOpen && <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </header>
  );
};

export default Header;