import { Router, Request, Response } from 'express';
import { db } from '../db';
import { carts, cartItems, books, purchases } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middlewares/auth';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2024-11-20.acacia'
});

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

interface RecordPurchaseBody {
  bookId: string;
  pdfUrl: string;
}

// Route pour créer la session de paiement
router.post('/create-session', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Récupérer le panier de l'utilisateur
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        items: {
          with: {
            book: true
          }
        }
      }
    });

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    if (!cart.items?.length) {
      return res.status(400).json({ message: 'Panier vide' });
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.book?.title || 'Livre',
          },
          unit_amount: parseInt((parseFloat(item.book?.price || '0') * 100).toString()),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: {
        userId,
        bookIds: JSON.stringify(cart.items.map(item => item.book?.id))
      },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    return res.json({ data: { id: session.id } });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return res.status(500).json({ message: 'Erreur lors de la création de la session' });
  }
});

router.post('/record-purchase', authMiddleware, async (req: AuthRequest & { body: RecordPurchaseBody }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { bookId, pdfUrl } = req.body;

    if (!userId || !bookId || !pdfUrl) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    await db.insert(purchases).values({
      userId,
      bookId,
      pdfUrl,
      purchaseDate: new Date()
    });

    return res.status(201).json({ message: 'Achat enregistré avec succès' });
  } catch (error) {
    console.error('Error recording purchase:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'achat' });
  }
});

export default router;