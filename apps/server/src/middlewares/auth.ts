import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };
    res.locals.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};