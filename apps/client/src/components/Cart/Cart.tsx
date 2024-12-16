import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { CartItem } from './CartItem';
import { initiateCheckout } from '../../services/stripe.service';
import { loadStripe } from '@stripe/stripe-js';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, total, clearCart, updateQuantity, removeItem } = useCartStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  // Empêcher le scroll quand le panier est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleRemoveItem = (id: string, title: string) => {
    removeItem(id);
    addNotification(`${title} retiré du panier`, 'info');
  };

  const handleUpdateQuantity = (id: string, quantity: number, title: string) => {
    updateQuantity(id, quantity);
    addNotification(`Quantité mise à jour`, 'info');
  };

  const handleClearCart = () => {
    clearCart();
    addNotification('Panier vidé', 'info');
    onClose();
  };

  const handleCheckout = async () => {
    const notification = useNotificationStore(state => state.addNotification);

    if (items.length === 0) {
      notification('Votre panier est vide', 'error');
      return;
    }

    try {
      notification('Préparation de votre commande...', 'info');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Si vous utilisez des tokens
        },
        body: JSON.stringify({ 
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const { data } = await response.json();

      // Redirection vers Stripe
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      if (!stripe) {
        throw new Error('Erreur lors du chargement de Stripe');
      }

      notification('Redirection vers la page de paiement...', 'info');

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id
      });

      if (error) {
        throw error;
      }

    } catch (error) {
      console.error('Erreur checkout:', error);
      notification(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors du paiement', 
        'error'
      );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'visible' : ''}`} 
        onClick={onClose}
      />

      {/* Cart */}
      <div className={`cart ${isOpen ? 'open' : ''}`}>
        <div className="cart__header">
          <h2>Panier ({items.length})</h2>
          <button
            className="cart__close"
            onClick={onClose}
            aria-label="Fermer le panier"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart--empty">
            <p>Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div className="cart__items">
              {items.map((item) => (
                <CartItem
                key={item.id}
                {...item}
                onUpdateQuantity={(quantity) =>
                  handleUpdateQuantity(item.id, quantity, item.title)
                }
                onRemove={() => handleRemoveItem(item.id, item.title)}
              />
            ))}
          </div>

          <div className="cart__footer">
            <div className="cart__total">
              Total: {total.toFixed(2)}€
            </div>
            <button 
              className="cart__clear"
              onClick={handleClearCart}
            >
              Vider le panier
            </button>
            <button 
              className="cart__checkout"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Procéder au paiement
            </button>
          </div>
        </>
      )}
    </div>
  </>
);
};

export default Cart;