import { api } from './api';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);

export const initiateCheckout = async (items: any[]) => {
  try {
    const response = await fetch('/checkout/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) throw new Error('Erreur lors de la création de la session');

    const { data } = await response.json();

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe non initialisé');

    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
    if (error) throw error;
  } catch (error) {
    console.error('Checkout error:', error);
  }
};