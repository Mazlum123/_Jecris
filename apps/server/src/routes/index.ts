import { Router } from 'express';
import authRoutes from './auth';
import bookRoutes from './books';
import cartRoutes from './cart';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);

export default router;