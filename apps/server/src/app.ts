import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';
import Stripe from 'stripe';
import { db } from './db';
import { purchases } from './db/schema';
import compression from 'compression';
import helmet from 'helmet';
import { apiLimiter } from './middlewares/rateLimiter';
import { path } from 'pdfkit';


const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

if (process.env.NODE_ENV === 'production') {
  const STATIC_PATH = path.join(__dirname, '../../client/dist');
  app.use(express.static(STATIC_PATH));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(STATIC_PATH, 'index.html'));
    }
  });
}

// WEBHOOK AVANT TOUT
app.post(
  '/webhook',
  (req, res, next) => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  },
  async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, bookIds } = session.metadata || {};

        if (userId && bookIds) {
          const parsedBookIds = JSON.parse(bookIds);

          for (const bookId of parsedBookIds) {
            await db.insert(purchases).values({
              userId,
              bookId,
              pdfUrl: `pdfs/${userId}/${bookId}.pdf`,
              purchaseDate: new Date()
            });
          }
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send('Webhook error');
    }
  }
);

// RESTE DES MIDDLEWARES
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
      frameSrc: ['js.stripe.com'],
      upgradeInsecureRequests: []
    }
  }
}));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue'
      : err.message
  });
});
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', router);
app.use('/api/', apiLimiter);
app.use((req, res, next) => {
  // Timeout de 30 secondes
  req.setTimeout(30000, () => {
    res.status(408).send('Request Timeout');
  });
  next();
});

export default app;