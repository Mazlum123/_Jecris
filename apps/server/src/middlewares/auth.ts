import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/responses';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        exp: number;
      };

      // Vérification de l'expiration
      if (Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ message: 'Token expiré' });
      }

      res.locals.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};