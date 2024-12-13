import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/responses';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    console.log('Auth Headers:', req.headers.authorization); // Log pour debug

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header'); // Log pour debug
      sendResponse(res, null, 'No token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token); // Log pour debug

    if (!token) {
      console.log('No token after split'); // Log pour debug
      sendResponse(res, null, 'No token provided', 401);
      return;
    }

    try {
      console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log pour debug
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      console.log('Decoded token:', decoded); // Log pour debug
      res.locals.user = decoded;
      next();
    } catch (error) {
      console.log('Token verification failed:', error);
      sendResponse(res, null, 'Invalid token', 401);
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    sendResponse(res, null, 'Authentication failed', 500);
  }};