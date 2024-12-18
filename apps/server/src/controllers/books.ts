import { Request, Response } from 'express';

export const getAllBooks = (_req: Request, res: Response): void => {
  res.json([
    { id: 1, title: 'Book A', author: 'Author A' },
    { id: 2, title: 'Book B', author: 'Author B' },
    { id: 3, title: 'Book C', author: 'Author C' },
  ]);
};

export const getBookById = (req: Request, res: Response): void => {
  const bookId = Number(req.params.id);
  const book = { id: bookId, title: `Book ${bookId}`, author: `Author ${bookId}` };
  res.json(book);
};

export const createBook = (req: Request, res: Response): void => {
  res.status(201).json({ message: 'Book created', book: req.body });
};

export const updateBook = (req: Request, res: Response): void => {
  res.json({ message: `Book ${req.params.id} updated`, book: req.body });
};

export const deleteBook = (req: Request, res: Response): void => {
  res.json({ message: `Book ${req.params.id} deleted` });
};
