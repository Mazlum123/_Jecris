interface CartItemProps {
    id: string;
    title: string;
    price: number;
    quantity: number;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
  }

  export const CartItem = ({ 
    title, 
    price, 
    quantity, 
    onUpdateQuantity, 
    onRemove 
  }: CartItemProps) => {
    return (
      <div className="cart-item">
        <div className="cart-item__info">
          <h3>{title}</h3>
          <p>{price}€</p>
        </div>
        <div className="cart-item__actions">
          <button 
            onClick={() => quantity > 1 && onUpdateQuantity(quantity - 1)}
            className="quantity-btn"
          >
            -
          </button>
          <span>{quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
          <button onClick={onRemove} className="remove-btn">
            Supprimer
          </button>
        </div>
      </div>
    );
  };

  // apps/client