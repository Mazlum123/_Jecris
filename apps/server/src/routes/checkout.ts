import { Router } from 'express';
import { db } from '../db';
import { carts, cartItems, books } from '../db/schema';
import { authMiddleware } from '../middlewares/auth';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });  // Initialisation de Stripe avec la clé secrète

// Route pour créer la session de paiement
router.post('/create-session', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Récupérer le panier de l'utilisateur
    const cart = await db.query.carts.findFirst({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const items = await db.query.cartItems.findMany({
      where: { cartId: cart.id },
      include: { book: true },  // Inclure les informations sur le livre
    });

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.book.title,
          },
          unit_amount: Math.round(Number(item.book.price) * 100), // Convertir le prix en centimes
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    });

    res.json({ data: { id: session.id } }); // Retourner l'ID de la session
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    next(error);
  }
});

export default router;
