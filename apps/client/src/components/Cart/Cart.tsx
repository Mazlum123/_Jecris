import { useCartStore } from '../../store/useCartStore';

export default function Cart() {
  const { items, total, removeItem, updateQuantity } = useCartStore();

  return (
    <div className="cart">
      <h2>Panier ({items.length})</h2>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item__info">
            <h3>{item.title}</h3>
            <p>{item.price}€</p>
          </div>
          <div className="cart-item__actions">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button onClick={() => removeItem(item.id)}>
              Supprimer
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        Total: {total.toFixed(2)}€
      </div>
    </div>
  );
}