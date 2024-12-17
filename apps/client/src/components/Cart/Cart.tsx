import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useAuthStore } from '../../store/authStore';
import { CartItem } from './CartItem';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, total, clearCart, updateQuantity, removeItem } = useCartStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const { token } = useAuthStore();

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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items }),
      });

      if (response.status === 401) {
        // Vider le panier
        clearCart();
        
        addNotification(
          'Votre session a expiré. Votre panier a été vidé. Veuillez vous reconnecter pour effectuer vos achats.', 
          'error'
        );
        onClose(); // Fermer le panier
        navigate('/auth/login', { 
          state: { 
            from: window.location.pathname,
            message: 'Reconnectez-vous pour continuer vos achats'
          } 
        });
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const { data } = await response.json();
      
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      if (!stripe) {
        throw new Error('Erreur lors du chargement de Stripe');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id
      });

      if (error) {
        throw error;
      }

    } catch (error) {
      console.error('Erreur checkout:', error);
      addNotification(
        'Une erreur est survenue. Veuillez réessayer dans quelques instants.', 
        'error'
      );
    }
  };

  useEffect(() => {
    if (!token) {
      clearCart();
      addNotification(
        'Session expirée. Votre panier a été vidé.', 
        'info'
      );
      onClose();
      navigate('/auth/login');
    }
  }, [token]);

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'visible' : ''}`} 
        onClick={onClose}
      />

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