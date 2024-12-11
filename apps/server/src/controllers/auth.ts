// apps/server/src/controllers/auth.ts
import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const { JWT_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await argon2.hash(password);

    // Créer l'utilisateur
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

    // Générer les tokens
    const token = jwt.sign(
      { userId: newUser.id },
      JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    // Envoyer les tokens dans des cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const foundUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!foundUser) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Vérifier le mot de passe
    const validPassword = await argon2.verify(foundUser.password, password);
    if (!validPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Générer les tokens
    const token = jwt.sign(
      { userId: foundUser.id },
      JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: foundUser.id },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });
  
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  export const logout = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  export const me = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = res.locals.user.userId;
      
      const foundUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          name: true,
          email: true,
        }
      });
  
      if (!foundUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        data: foundUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };