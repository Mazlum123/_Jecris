import { Request, Response } from 'express';
import { db } from '../db';
import { books } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sendResponse } from '../utils/responses';
import { z } from 'zod';

const bookschema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    imageUrl: z.string().url().optional(),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
  });

// Récupérer tous les produits
export const getAllBooks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const booksList = await db.query.books.findMany({
      orderBy: (books, { desc }) => [desc(books.createdAt)],
    });

    sendResponse(res, booksList, 'Books retrieved successfully', 200);
  } catch (error) {
    console.error('Get books error:', error);
    sendResponse(res, null, 'Failed to retrieve books', 500);
  }
};

// Récupérer un livre par ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await db.query.books.findFirst({
      where: eq(books.id, id),
    });

    if (!product) {
      sendResponse(res, null, 'Product not found', 404);
      return;
    }

    sendResponse(res, product, 'Product retrieved successfully', 200);
  } catch (error) {
    console.error('Get product error:', error);
    sendResponse(res, null, 'Failed to retrieve product', 500);
  }
};

// Créer un nouveau livre
export const createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = bookSchema.parse(req.body);
      const authorId = res.locals.user.userId;
  
      const [newProduct] = await db.insert(books)
        .values({
          title: validatedData.title,
          description: validatedData.description,
          price: validatedData.price.toString(),
          imageUrl: validatedData.imageUrl,
          stock: validatedData.stock,
          authorId
        })
        .returning();
  
      sendResponse(res, newBook, 'Book created successfully', 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        sendResponse(res, null, error.errors[0].message, 400);
        return;
      }
      console.error('Create book error:', error);
      sendResponse(res, null, 'Failed to create book', 500);
    }
  };
  
  // Mettre à jour un livre
  export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = booksSchema.partial().parse(req.body);
      const authorId = res.locals.user.userId;
  
      const existingBook = await db.query.books.findFirst({
        where: eq(books.id, id),
      });
  
      if (!existingBook) {
        sendResponse(res, null, 'Book not found', 404);
        return;
      }
  
      if (existingBook.authorId !== authorId) {
        sendResponse(res, null, 'Unauthorized to update this book', 403);
        return;
      }
  
      const updateData = {
        ...validatedData,
        price: validatedData.price?.toString(),
        updatedAt: new Date(),
      };
  
      const [updatedProduct] = await db.update(books)
        .set(updateData)
        .where(eq(books.id, id))
        .returning();
  
      sendResponse(res, updatedBook, 'Product updated successfully', 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        sendResponse(res, null, error.errors[0].message, 400);
        return;
      }
      console.error('Update product error:', error);
      sendResponse(res, null, 'Failed to update product', 500);
    }
  };
  
  // Supprimer un livre
  export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const authorId = res.locals.user.userId;
  
      // Vérifier que l'utilisateur est bien l'auteur du livre
      const existingProduct = await db.query.books.findFirst({
        where: eq(books.id, id),
      });
  
      if (!existingBook) {
        sendResponse(res, null, 'Book not found', 404);
        return;
      }
  
      if (existingBook.authorId !== authorId) {
        sendResponse(res, null, 'Unauthorized to delete this book', 403);
        return;
      }
  
      await db.delete(books).where(eq(books.id, id));
  
      sendResponse(res, null, 'Book deleted successfully', 200);
    } catch (error) {
      console.error('Delete book error:', error);
      sendResponse(res, null, 'Failed to delete book', 500);
    }
  };