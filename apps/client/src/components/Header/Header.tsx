import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { Cart } from '../Cart/Cart';

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore(state => state.items.length);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">JeCris</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/library">Ma bibliothèque</Link></li>
          <li><Link to="/add-book">Ajouter un livre</Link></li>
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
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};