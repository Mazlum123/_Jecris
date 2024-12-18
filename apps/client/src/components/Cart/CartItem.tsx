import React from 'react';
import { api } from '../../services/api';
import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  price,
  quantity,
  imageUrl,
  onUpdateQuantity,
  onRemove
}) => {
  const addNotification = useNotificationStore(state => state.addNotification);

  const handlePurchase = async () => {
    try {
      console.log('Tentative d\'achat du livre:', { id, title });
      const response = await api.post('/simulate-purchase', { bookId: id });
      console.log('Réponse:', response.data);
      
      addNotification('Achat réussi !', 'success');
      
      setTimeout(() => {
        // Logique de redirection après achat
      }, 1000);
    } catch (error) {
      console.error('Erreur d\'achat:', error);
      addNotification('Erreur lors de l\'achat', 'error');
    }
  };

  return (
    <div className="cart-item">
      {imageUrl && (
        <div className="cart-item__image">
          <img src={imageUrl} alt={title} loading="lazy" />
        </div>
      )}

      <div className="cart-item__content">
        <h3 className="cart-item__title">{title}</h3>
        <p className="cart-item__price">{price.toFixed(2)}€</p>

        <div className="cart-item__quantity">
          <button
            className="cart-item__quantity-btn"
            onClick={() => quantity > 1 && onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
          >
            -
          </button>
          <span className="cart-item__quantity-value">{quantity}</span>
          <button
            className="cart-item__quantity-btn"
            onClick={() => onUpdateQuantity(quantity + 1)}
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>

        <p className="cart-item__subtotal">
          Sous-total: {(price * quantity).toFixed(2)}€
        </p>

        <button
          className="cart-item__purchase"
          onClick={handlePurchase}
          aria-label="Acheter maintenant"
        >
          Acheter maintenant ({price.toFixed(2)}€)
        </button>
      </div>

      <button
        className="cart-item__remove"
        onClick={onRemove}
        aria-label="Supprimer du panier"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};
