import Stripe from 'stripe';
import { Request, Response } from 'express';
import { sendResponse } from '../utils/responses';
import { db } from '../db';
import { books, purchases, cartItems, carts } from '../db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    const userId = res.locals.user.userId;

    console.log('Creating checkout session with metadata:', {
      userId,
      bookIds: JSON.stringify(items.map((item: any) => item.id))
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(parseFloat(item.price) * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: {
        userId,
        bookIds: JSON.stringify(items.map((item: any) => item.id))
      },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    console.log('Session created:', session);
    sendResponse(res, { id: session.id }, 'Session de paiement créée', 200);
  } catch (error) {
    console.error('Stripe session error:', error);
    sendResponse(res, null, 'Erreur lors de la création de la session de paiement', 500);
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    console.log('=== Webhook Start ===');
    console.log('Signature:', sig);
    console.log('Body:', req.body.toString());

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      webhookSecret!
    );

    console.log('Event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Session:', session);
      
      const { userId, bookIds } = session.metadata || {};
      console.log('Metadata:', { userId, bookIds });

      // Créer l'achat
      const parsedBookIds = JSON.parse(bookIds || '[]');
      for (const bookId of parsedBookIds) {
        await db.insert(purchases).values({
          userId,
          bookId,
          pdfUrl: `pdfs/${userId}/${bookId}.pdf`,
        });
        console.log('Purchase created:', { userId, bookId });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
  
  export const getPurchases = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.userId;
      console.log('Getting purchases for user:', userId);
  
      const userPurchases = await db.query.purchases.findMany({
        where: eq(purchases.userId, userId),
        with: {
          book: true
        }
      });
  
      console.log('Found purchases:', userPurchases);
      sendResponse(res, userPurchases, 'Purchases retrieved successfully', 200);
    } catch (error) {
      console.error('Get purchases error:', error);
      sendResponse(res, null, 'Failed to get purchases', 500);
    }
  };