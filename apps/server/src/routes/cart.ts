import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart,
  getCartTotal
} from '../controllers/cart';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Toutes les routes du panier nécessitent une authentification
router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/items/:itemId', removeFromCart);
router.put('/items/:itemId', updateCartItemQuantity);
router.delete('/clear', clearCart);
router.get('/total', authMiddleware, getCartTotal);

export default router;