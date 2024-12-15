import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useNotificationStore } from '../store/useNotificationStore';

export const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);
  const addNotification = useNotificationStore(state => state.addNotification);

  useEffect(() => {
    // Simuler un traitement de commande réussie
    clearCart();
    addNotification('Commande validée avec succès !', 'success');
    
    // Redirection après 3 secondes
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="checkout-success">
      <div className="checkout-success__content">
        <h1>Commande confirmée !</h1>
        <p>Merci pour votre achat.</p>
        <p>Vous allez être redirigé vers la page d'accueil...</p>
      </div>
    </div>
  );
};