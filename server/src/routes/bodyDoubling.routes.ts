import { Router } from 'express';
import { BodyDoublingController } from '../controllers/bodyDoubling.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/active', BodyDoublingController.getActiveSession);
router.put('/:id', BodyDoublingController.updateSession);
router.get('/history', BodyDoublingController.getHistory);

export default router;
