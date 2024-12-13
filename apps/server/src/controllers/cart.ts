// apps/server/src/controllers/cart.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { carts, cartItems, books } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { sendResponse } from '../utils/responses';

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        items: {
          with: {
            book: true
          }
        }
      }
    });

    if (!cart) {
      const [newCart] = await db.insert(carts)
        .values({ userId })
        .returning();

      sendResponse(res, { ...newCart, items: [] }, 'New cart created', 200);
      return;
    }

    sendResponse(res, cart, 'Cart retrieved successfully', 200);
  } catch (error) {
    console.error('Get cart error:', error);
    sendResponse(res, null, 'Failed to retrieve cart', 500);
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const { bookId, quantity = 1 } = req.body;

    // Vérifier si le livre existe
    const book = await db.query.books.findFirst({
      where: eq(books.id, bookId),
    });

    if (!book) {
      sendResponse(res, null, 'Book not found', 404);
      return;
    }

    // Trouver ou créer le panier
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });

    if (!cart) {
      [cart] = await db.insert(carts)
        .values({ userId })
        .returning();
    }

    // Vérifier si l'article existe déjà
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.bookId, bookId)
      )
    });

    if (existingItem) {
      const [updatedItem] = await db.update(cartItems)
        .set({
          quantity: existingItem.quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();

      sendResponse(res, updatedItem, 'Cart item quantity updated', 200);
      return;
    }

    const [newItem] = await db.insert(cartItems)
      .values({
        cartId: cart.id,
        bookId,
        quantity,
      })
      .returning();

    sendResponse(res, newItem, 'Item added to cart successfully', 201);
  } catch (error) {
    console.error('Add to cart error:', error);
    sendResponse(res, null, 'Failed to add item to cart', 500);
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const { itemId } = req.params;

    const cartItem = await db.query.cartItems.findFirst({
      where: eq(cartItems.id, itemId),
      with: {
        cart: true
      }
    });

    if (!cartItem || !cartItem.cart || cartItem.cart.userId !== userId) {
      sendResponse(res, null, 'Cart item not found', 404);
      return;
    } await db.delete(cartItems)
    .where(eq(cartItems.id, itemId));

  sendResponse(res, null, 'Item removed from cart successfully', 200);
} catch (error) {
  console.error('Remove from cart error:', error);
  sendResponse(res, null, 'Failed to remove item from cart', 500);
}
};

export const updateCartItemQuantity = async (req: Request, res: Response): Promise<void> => {
try {
  const userId = res.locals.user.userId;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    sendResponse(res, null, 'Quantity must be at least 1', 400);
    return;
  }

  const cartItem = await db.query.cartItems.findFirst({
    where: eq(cartItems.id, itemId),
    with: {
      cart: true,
      book: true
    }
  });

  if (!cartItem || !cartItem.cart || cartItem.cart.userId !== userId) {
    sendResponse(res, null, 'Cart item not found', 404);
    return;
  }

  if (!cartItem.book || cartItem.book.stock < quantity) {
    sendResponse(res, null, 'Not enough stock available', 400);
    return;
  }

  const [updatedItem] = await db.update(cartItems)
    .set({
      quantity,
      updatedAt: new Date(),
    })
    .where(eq(cartItems.id, itemId))
    .returning();

  sendResponse(res, updatedItem, 'Cart item quantity updated successfully', 200);
} catch (error) {
  console.error('Update cart item quantity error:', error);
  sendResponse(res, null, 'Failed to update cart item quantity', 500);
}
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
try {
  const userId = res.locals.user.userId;

  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  });

  if (!cart) {
    sendResponse(res, null, 'Cart not found', 404);
    return;
  }

  await db.delete(cartItems)
    .where(eq(cartItems.cartId, cart.id));

  sendResponse(res, null, 'Cart cleared successfully', 200);
} catch (error) {
  console.error('Clear cart error:', error);
  sendResponse(res, null, 'Failed to clear cart', 500);
}
};

export const getCartTotal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        items: {
          with: {
            book: true
          }
        }
      }
    });

    if (!cart) {
      sendResponse(res, { total: 0 }, 'Cart is empty', 200);
      return;
    }

    const total = cart.items.reduce((sum, item) => {
      const price = parseFloat(item.book?.price || '0');
      return sum + (price * item.quantity);
    }, 0);

    sendResponse(res, { 
      total,
      itemCount: cart.items.length,
      items: cart.items.map(item => ({
        id: item.id,
        title: item.book?.title,
        price: item.book?.price,
        quantity: item.quantity,
        subtotal: parseFloat(item.book?.price || '0') * item.quantity
      }))
    }, 'Cart total calculated successfully', 200);
  } catch (error) {
    console.error('Get cart total error:', error);
    sendResponse(res, null, 'Failed to calculate cart total', 500);
  }
};