import { Router } from 'express';
import { CampController } from '../controllers/camp.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadPaymentSlip } from '../middleware/upload.middleware.js';

const router = Router();

// Public / information
router.get('/info', CampController.getCampInfo);

// Protected routes
router.post(
  '/register',
  authenticate,
  uploadPaymentSlip.single('paymentSlip'),
  CampController.register
);

router.get('/my-registrations', authenticate, CampController.getMyRegistrations);
router.post('/my-registrations/:id/cancel', authenticate, CampController.cancelMyRegistration);

export default router;
