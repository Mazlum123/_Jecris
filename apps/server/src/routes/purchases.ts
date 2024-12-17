import { Router } from 'express';
import { getUserPurchases } from '../controllers/purchases';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, getUserPurchases);

export default router;