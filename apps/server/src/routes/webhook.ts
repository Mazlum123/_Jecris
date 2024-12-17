import { Router, Request, Response } from 'express';
import express from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { purchases } from '../db/schema';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

// Route de test pour vérifier que le webhook est accessible
router.get('/test', (req, res) => {
  res.json({ message: 'Webhook endpoint is working' });
});

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    console.log('=== Webhook Called ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body.toString());

    const sig = req.headers['stripe-signature'];
    console.log('Stripe Signature:', sig);

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    console.log('Webhook Secret (first 10 chars):', webhookSecret?.substring(0, 10));

    if (!sig || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      res.status(400).json({ error: 'Missing signature or webhook secret' });
      return;
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );

      console.log('Event constructed successfully');
      console.log('Event Type:', event.type);
      console.log('Event Data:', JSON.stringify(event.data.object, null, 2));

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout session:', session.id);
        console.log('Session metadata:', session.metadata);

        const { userId, bookIds } = session.metadata || {};
        if (!userId || !bookIds) {
          console.error('Missing metadata:', { userId, bookIds });
          res.status(400).json({ error: 'Missing metadata' });
          return;
        }

        try {
          const parsedBookIds = JSON.parse(bookIds);
          console.log('Parsed book IDs:', parsedBookIds);

          for (const bookId of parsedBookIds) {
            const [purchase] = await db.insert(purchases).values({
              userId,
              bookId,
              pdfUrl: `pdfs/${userId}/${bookId}.pdf`,
              purchaseDate: new Date()
            }).returning();
            
            console.log('Purchase created:', purchase);
          }

          console.log('All purchases created successfully');
          res.json({ success: true });
        } catch (dbError) {
          console.error('Database error:', dbError);
          res.status(500).json({ error: 'Database error' });
        }
      } else {
        console.log('Unhandled event type');
        res.json({ received: true });
      }
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ 
        error: 'Webhook error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export default router;