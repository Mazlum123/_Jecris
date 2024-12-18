import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token manquant' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      exp: number;
    };

    // Vérifie l'expiration du token
    if (Date.now() >= decoded.exp * 1000) {
      res.status(401).json({ message: 'Token expiré' });
      return;
    }

    req.user = { userId: decoded.userId }; // Associe userId à l'objet `req`
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
    return;
  }
};
