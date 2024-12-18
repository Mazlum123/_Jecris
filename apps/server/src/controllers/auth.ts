import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { logError } from '../utils/logger';

// Enregistrement d'utilisateur
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    await db.insert(users).values({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logError('register', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Connexion
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !(await argon2.verify(user.password, password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    logError('login', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Récupération des données utilisateur
export const me = (req: Request, res: Response): void => {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    logError('me', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

// Déconnexion
export const logout = (_req: Request, res: Response): void => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logError('logout', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};
