import { Router } from 'express';
import { EventController } from '../controllers/event.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { uploadEventPoster } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', EventController.list);
router.get('/posters/:filename', EventController.poster);
router.post('/', authenticateAdmin, requireAdmin, uploadEventPoster.single('poster'), EventController.create);
router.put('/:id', authenticateAdmin, requireAdmin, uploadEventPoster.single('poster'), EventController.update);
router.delete('/:id', authenticateAdmin, requireAdmin, EventController.remove);

export default router;
