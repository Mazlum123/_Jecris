import { Router } from 'express';
import authRoutes from './auth';

const router: Router = Router();

// Inclusion des routes d'authentification
router.use('/auth', authRoutes);

export default router;
