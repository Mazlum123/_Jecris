import { Router } from 'express';
import authRoutes from './auth';
import bookRoutes from './books';
// import cartRoutes from './cart'; // A ajouter plus tar

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
// router.use('/cart', cartRoutes); // À implémenter plus tard

export default router;