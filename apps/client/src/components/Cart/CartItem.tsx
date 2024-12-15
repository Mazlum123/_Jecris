import React from 'react';

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
  title,
  price,
  quantity,
  imageUrl,
  onUpdateQuantity,
  onRemove
}) => {
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

export default CartItem;