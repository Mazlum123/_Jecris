import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import { db } from '../db';
import { books, purchases } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middlewares/auth';
import authRoutes from './auth';
import bookRoutes from './books';
import cartRoutes from './cart';
import purchasesRoutes from './purchases';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

// Route de simulation d'achat
router.post('/simulate-purchase', authMiddleware, async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { bookId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Non autorisé' });
      return;
    }

    const book = await db.query.books.findFirst({
      where: eq(books.id, bookId)
    });

    if (!book) {
      res.status(404).json({ error: 'Livre non trouvé' });
      return;
    }

    const [purchase] = await db.insert(purchases).values({
      userId,
      bookId,
      pdfUrl: `pdfs/${userId}/${bookId}.pdf`,
      purchaseDate: new Date()
    }).returning();

    res.json({ success: true, purchase });
  } catch (error) {
    next(error);
  }
});

// Routes existantes
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);
router.use('/purchases', purchasesRoutes);
router.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
router.use('*', (req: Request, res: Response) => {
  if (req.accepts('html')) {
    res.status(404).json({ message: 'Page non trouvée' });
    return;
  }

  if (req.accepts('json')) {
    res.status(404).json({ message: 'Endpoint non trouvé' });
    return;
  }

  res.status(404).send('Non trouvé');
});

export default router;