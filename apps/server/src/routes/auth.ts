import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);

export default router;