import express, { Request, Response } from 'express';
import { db } from './db/index';
import { books } from './db/schema';

const app = express();
const port = 3000;

app.get('/test-db', async (req: Request, res: Response) => {
  try {
    const allBooks = await db.select().from(books);
    res.json({ success: true, data: allBooks });
  } catch (error) {
    console.error('Erreur lors de l\'accès à la base de données :', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Serveur de test en écoute sur http://localhost:${port}`);
});
