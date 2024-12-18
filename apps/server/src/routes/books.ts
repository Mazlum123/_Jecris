import { Router } from 'express';
import { db } from '../db';
import { books } from '../db/schema';

const router = Router();

// Route pour récupérer tous les livres
router.get('/books', async (req, res) => {
  try {
    const allBooks = await db.query.books.findMany();
    res.status(200).json(allBooks);
  } catch (error) {
    console.error('Erreur backend :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des livres.' });
  }
});

export default router;
