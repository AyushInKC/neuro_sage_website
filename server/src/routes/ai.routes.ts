import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/chat', aiLimiter, AIController.sendMessage);
router.get('/history', AIController.getHistory);
router.delete('/history', AIController.clearHistory);

export default router;
