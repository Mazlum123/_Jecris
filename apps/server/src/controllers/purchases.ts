import { Request, Response } from 'express';
import { db } from '../db';
import { purchases } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sendResponse } from '../utils/responses';

export const getUserPurchases = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.userId;
    console.log('Getting purchases for user:', userId);

    const userPurchases = await db.query.purchases.findMany({
      where: eq(purchases.userId, userId),
      with: {
        book: true
      }
    });

    console.log('Found purchases:', userPurchases);
    sendResponse(res, userPurchases, 'Purchases retrieved successfully', 200);
  } catch (error) {
    console.error('Get purchases error:', error);
    sendResponse(res, null, 'Failed to get purchases', 500);
  }
};