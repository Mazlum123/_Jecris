import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/books
router.get('/', async (req: Request, res: Response) => {
  try {
    // Pour l'instant, retournons des données mockées
    res.json({
      data: [
        { id: 1, title: 'Premier livre', price: 9.99 },
        { id: 2, title: 'Deuxième livre', price: 14.99 }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;