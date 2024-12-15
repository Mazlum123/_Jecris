import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const initiateCheckout = async (items: any[]) => {
  try {
    // 1. Créer la session de paiement via notre API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session');
    }

    const { data } = await response.json();

    // 2. Rediriger vers Stripe
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe non initialisé');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: data.id,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};