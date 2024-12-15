import { Router } from 'express';
import authRoutes from './auth';
import bookRoutes from './books';
import cartRoutes from './cart';
import { createCheckoutSession } from '../controllers/checkout';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);
router.post('/checkout/create-session', createCheckoutSession);

export default router;