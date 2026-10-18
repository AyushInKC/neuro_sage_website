import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { LiveBodyDoublingController } from '../controllers/liveBodyDoubling.controller.js';

const router = Router();
router.get('/payment-qr', LiveBodyDoublingController.paymentQr);
router.use(authenticate);
router.get('/payment-info', LiveBodyDoublingController.paymentInfo);
router.get('/entitlement', LiveBodyDoublingController.getEntitlement);
router.post('/payments', LiveBodyDoublingController.submitPayment);
router.get('/session/active', LiveBodyDoublingController.getActiveSession);
router.post('/session/:id/join', LiveBodyDoublingController.joinSession);
router.post('/session/:id/leave', LiveBodyDoublingController.leaveSession);
export default router;

export const adminLiveBodyDoublingRouter = Router();
adminLiveBodyDoublingRouter.use(authenticate, requireAdmin);
adminLiveBodyDoublingRouter.get('/payments', LiveBodyDoublingController.listPayments);
adminLiveBodyDoublingRouter.post('/payments/:id/approve', LiveBodyDoublingController.verifyPayment);
adminLiveBodyDoublingRouter.post('/payments/:id/reject', LiveBodyDoublingController.rejectPayment);
adminLiveBodyDoublingRouter.get('/sessions', LiveBodyDoublingController.listSessions);
adminLiveBodyDoublingRouter.post('/sessions', LiveBodyDoublingController.createSession);
adminLiveBodyDoublingRouter.post('/sessions/:id/end', LiveBodyDoublingController.endSession);
