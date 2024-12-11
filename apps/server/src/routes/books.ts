import { Router, Request, Response } from 'express';
import { db } from '../db';  // Importez votre instance db
import { books } from '../db/schema';  // Importez votre schéma

const router = Router();

// GET /api/books
router.get('/', async (req: Request, res: Response) => {
  try {
    const allBooks = await db.select().from(books);
    res.json({ data: allBooks });
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/books
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, price, description } = req.body;
    const newBook = await db.insert(books).values({
      title,
      price,
      description
    }).returning();
    res.status(201).json({ data: newBook[0] });
  } catch (error) {
    console.error('Erreur lors de la création du livre:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;