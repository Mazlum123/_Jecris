import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sendResponse } from '../utils/responses';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      sendResponse(res, null, 'Email already in use', 409);
      return;
    }

    const hashedPassword = await argon2.hash(validatedData.password);

    const [newUser] = await db.insert(users).values({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    sendResponse(res, { ...newUser, token }, 'Registration successful', 201);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      sendResponse(res, null, error.errors[0].message, 400);
      return;
    }
    console.error('Registration error:', error);
    sendResponse(res, null, 'Internal server error', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (!user) {
      sendResponse(res, null, 'Invalid credentials', 401);
      return;
    }

    const validPassword = await argon2.verify(user.password, validatedData.password);
    if (!validPassword) {
      sendResponse(res, null, 'Invalid credentials', 401);
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      token
    };

    sendResponse(res, userData, 'Login successful', 200);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      sendResponse(res, null, error.errors[0].message, 400);
      return;
    }
    console.error('Login error:', error);
    sendResponse(res, null, 'Internal server error', 500);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    sendResponse(res, null, 'Logout successful', 200);
  } catch (error: unknown) {
    console.error('Logout error:', error);
    sendResponse(res, null, 'Internal server error', 500);
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Me route - user from token:', res.locals.user);
    const userId = res.locals.user.userId;
    console.log('Looking for user with ID:', userId);

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
      }
    });
    console.log('Found user:', user);

    if (!user) {
      sendResponse(res, null, 'User not found', 404);
      return;
    }

    sendResponse(res, user, 'User data retrieved successfully', 200);
  } catch (error: unknown) {
    console.error('Get user error:', error);
    sendResponse(res, null, 'Internal server error', 500);
  }
};

// Optionnel : Rafraîchissement du token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const newToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    sendResponse(res, { token: newToken }, 'Token refreshed successfully', 200);
  } catch (error: unknown) {
    console.error('Token refresh error:', error);
    sendResponse(res, null, 'Internal server error', 500);
  }
};