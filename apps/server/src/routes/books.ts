import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { books, purchases } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middlewares/auth';
import path from 'path';
import fs from 'fs';
import { generatePDF } from '../services/pdfService';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/books';

const router = Router();

// Interface personnalisée pour la requête avec user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', authMiddleware, createBook);
router.put('/:id', authMiddleware, updateBook);
router.delete('/:id', authMiddleware, deleteBook);

router.get(
  '/:id/download',
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const bookId = req.params.id;

      if (!userId) {
        res.status(401).json({ error: 'Non autorisé' });
        return;
      }

      // Vérifie si l'utilisateur a acheté le livre
      const purchase = await db.query.purchases.findFirst({
        where: and(eq(purchases.userId, userId), eq(purchases.bookId, bookId)),
      });

      if (!purchase) {
        res.status(403).json({ error: "Vous n'avez pas acheté ce livre" });
        return;
      }

      let pdfPath = path.join(__dirname, '..', '..', purchase.pdfUrl);

      if (!fs.existsSync(pdfPath)) {
        const book = await db.query.books.findFirst({
          where: eq(books.id, bookId),
        });

        if (!book) {
          res.status(404).json({ error: 'Livre non trouvé' });
          return;
        }

        // Générer le PDF
        const newPdfUrl = await generatePDF(userId, book);
        pdfPath = path.join(__dirname, '..', '..', newPdfUrl);

        // Mettre à jour la base de données
        await db
          .update(purchases)
          .set({ pdfUrl: newPdfUrl })
          .where(eq(purchases.id, purchase.id));
      }

      res.download(pdfPath, `${bookId}.pdf`, (err) => {
        if (err) {
          console.error('Erreur lors du téléchargement du fichier :', err);
          res.status(500).json({ error: 'Erreur serveur lors du téléchargement' });
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      next(error);
    }
  }
);

export default router;