import { Request, Response } from 'express';
import { db } from '../db';
import { books } from '../db/schema';

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const allBooks = await db.select().from(books);
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await db.select().from(books).where(eq(books.id, id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching book' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = await db.insert(books).values(req.body).returning();
    res.status(201).json(newBook[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating book' });
  }
};