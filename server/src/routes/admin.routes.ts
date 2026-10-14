import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.get('/registrations', AdminController.getRegistrations);
router.post('/registrations/:id/verify', AdminController.verifyPayment);
router.post('/registrations/:id/reject', AdminController.rejectPayment);
router.post('/registrations/:id/cancel', AdminController.cancelRegistration);
router.get('/registrations/:id/payment-slip', AdminController.getPaymentSlip);
router.get('/stats', AdminController.getAdminStats);
router.put('/camp-config', AdminController.updateCampConfig);

export default router;
