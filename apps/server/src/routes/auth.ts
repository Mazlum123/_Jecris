// apps/server/src/routes/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import { register, login, me, logout } from '../controllers/auth';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = Router();

// Modifiez les types de retour des fonctions de middleware
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    await register(req, res);
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    await login(req, res);
});

router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    await me(req, res);
});

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
    await logout(req, res);
});

export default router;