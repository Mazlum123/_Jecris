import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { initiateCheckout } from '../../services/stripe.service';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, total } = useCartStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleCheckout = async () => {
    try {
      // Initialiser le processus de paiement avec les items du panier
      await initiateCheckout(items);
      addNotification('Redirection vers le paiement...', 'info');
    } catch (error) {
      addNotification('Erreur lors du paiement', 'error');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cart">
      <button className="cart__close" onClick={onClose}>
        Fermer
      </button>
      <div className="cart__total">
        Total: {total.toFixed(2)}€
      </div>
      <button onClick={handleCheckout} disabled={items.length === 0}>
        Procéder au paiement
      </button>
    </div>
  );
};

export default Cart;
