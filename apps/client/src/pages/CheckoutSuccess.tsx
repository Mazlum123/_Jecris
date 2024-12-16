import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Vider le panier après un achat réussi
    clearCart();
    
    // Rediriger vers la bibliothèque après 3 secondes
    const timer = setTimeout(() => {
      navigate('/library');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="checkout-success">
      <h1>Paiement réussi !</h1>
      <p>Votre commande a été confirmée.</p>
      <p>Vous allez être redirigé vers votre bibliothèque...</p>
    </div>
  );
};