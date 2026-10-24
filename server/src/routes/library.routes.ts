import { Router } from 'express';
import { LibraryController } from '../controllers/library.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { uploadEventPoster } from '../middleware/upload.middleware.js';

const router = Router();
router.get('/', LibraryController.list);
router.get('/books/images/:filename', LibraryController.image);
router.post('/books', authenticateAdmin, requireAdmin, uploadEventPoster.single('bookImage'), LibraryController.createBook);
router.delete('/books/:id', authenticateAdmin, requireAdmin, LibraryController.deleteBook);
router.post('/quotes', authenticateAdmin, requireAdmin, LibraryController.createQuote);
router.delete('/quotes/:id', authenticateAdmin, requireAdmin, LibraryController.deleteQuote);
export default router;
