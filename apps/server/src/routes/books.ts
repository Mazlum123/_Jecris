import { Router } from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/books';

const router: Router = Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
