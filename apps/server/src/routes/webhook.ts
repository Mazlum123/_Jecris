import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

const router = Router();

// Initialise Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  const payload = req.body;

  try {
    // Utilisation du secret de Stripe Webhook
    const event = stripe.webhooks.constructEvent(
      payload, 
      sig, 
      'whsec_dd35eaf6b64ffefebfdf796ebd9b28a85c13e63b32155ce77e88beb2a274c388'
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('Paiement réussi :', paymentIntent);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log('Paiement échoué :', paymentIntent);
    } else {
      console.log(`Événement Stripe non traité : ${event.type}`);
    }

    res.status(200).send('Webhook reçu');
  } catch (error: unknown) {
    console.error('Erreur lors du traitement du webhook:', error);
    res.status(500).send('Erreur serveur');
  }
});

export default router;
