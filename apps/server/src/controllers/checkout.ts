import Stripe from 'stripe';
import { Request, Response } from 'express';
import { sendResponse } from '../utils/responses';
import { db } from '../db';
import { books, purchases } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateBookPDF } from '../services/pdf.service';
import { sendPurchaseEmail } from '../services/email.service';
import { saveFile } from '../utils/file';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia'
  });

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    sendResponse(res, { id: session.id }, 'Session de paiement créée', 200);
  } catch (error) {
    console.error('Stripe session error:', error);
    sendResponse(res, null, 'Erreur lors de la création de la session de paiement', 500);
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Gérer les différents événements
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Mettre à jour la commande dans la base de données
        await handleSuccessfulPayment(session);
        break;
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object;
        // Gérer l'échec du paiement
        await handleFailedPayment(paymentIntent);
        break;
      default:
        console.log(`Événement non géré : ${event.type}`);
    }

    sendResponse(res, null, 'Webhook reçu avec succès', 200);
  } catch (err) {
    console.error('Webhook error:', err);
    sendResponse(res, null, 'Erreur webhook', 400);
  }
};

async function handleSuccessfulPayment(session: any) {
  try {
    const { userId, bookId } = session.metadata;

    // Générer le PDF
    const book = await db.query.books.findFirst({
      where: eq(books.id, bookId)
    });

    if (!book) throw new Error('Book not found');

    const pdfBuffer = await generateBookPDF(book);

    // Stocker le PDF (ici exemple avec stockage local)
    const pdfPath = `pdfs/${userId}/${bookId}.pdf`;
    await saveFile(pdfPath, pdfBuffer);

    // Enregistrer l'achat
    await db.insert(purchases).values({
      userId,
      bookId,
      pdfUrl: pdfPath,
    });

    // Envoyer un email avec le lien de téléchargement
    await sendPurchaseEmail(userId, book.title, pdfPath);
  } catch (error) {
    console.error('Post-payment processing error:', error);
  }
}

async function handleFailedPayment(paymentIntent: any) {
  // TODO: Implémenter la logique en cas d'échec
  // - Marquer la commande comme échouée
  // - Notifier l'utilisateur
  // - Logger l'erreur
  console.log('Paiement échoué:', paymentIntent.id);
}

// Route pour vérifier le statut d'une session
export const checkSessionStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    sendResponse(res, { status: session.payment_status }, 'Statut récupéré', 200);
  } catch (error) {
    console.error('Check session status error:', error);
    sendResponse(res, null, 'Erreur lors de la vérification du statut', 500);
  }
};

// Route pour récupérer l'historique des paiements d'un utilisateur
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.userId;

    const paymentIntents = await stripe.paymentIntents.list({
      customer: userId, // Nécessite d'avoir lié l'utilisateur à un customer Stripe
      limit: 10,
    });

    const history = paymentIntents.data.map(intent => ({
      id: intent.id,
      amount: intent.amount / 100, // Convertir les centimes en euros
      status: intent.status,
      date: new Date(intent.created * 1000),
    }));

    sendResponse(res, history, 'Historique des paiements récupéré', 200);
  } catch (error) {
    console.error('Payment history error:', error);
    sendResponse(res, null, 'Erreur lors de la récupération de l\'historique', 500);
  }
};

// Route pour rembourser un paiement
export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    sendResponse(res, refund, 'Remboursement effectué', 200);
  } catch (error) {
    console.error('Refund error:', error);
    sendResponse(res, null, 'Erreur lors du remboursement', 500);
  }
};

// Fonction utilitaire pour créer ou récupérer un customer Stripe
async function getOrCreateCustomer(userId: string, email: string) {
  try {
    // Chercher d'abord si le customer existe déjà
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    }

    // Sinon, créer un nouveau customer
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId: userId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
}

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'eur' } = req.body;
    const userId = res.locals.user.userId;
    const userEmail = res.locals.user.email;

    // Récupérer ou créer le customer
    const customerId = await getOrCreateCustomer(userId, userEmail);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    sendResponse(res, {
      clientSecret: paymentIntent.client_secret
    }, 'Payment intent créé', 200);
  } catch (error) {
    console.error('Create payment intent error:', error);
    sendResponse(res, null, 'Erreur lors de la création du payment intent', 500);
  }
};