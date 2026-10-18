import { Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { Types } from 'mongoose';
import { config } from '../config/index.js';
import { LiveBodyDoublingPayment } from '../models/LiveBodyDoublingPayment.js';
import { LiveBodyDoublingSession } from '../models/LiveBodyDoublingSession.js';
import { BodyDoublingSession } from '../models/BodyDoublingSession.js';

const paymentSchema = z.object({ utr: z.string().trim().min(6).max(40).regex(/^[A-Za-z0-9-]+$/, 'Enter a valid UTR or transaction reference.') });

async function hasAccess(userId: string): Promise<boolean> {
  return Boolean(await LiveBodyDoublingPayment.exists({ userId, product: 'live_body_doubling', status: 'approved' }));
}

function requireUser(req: Request, res: Response): string | null {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return null;
  }
  return req.user.id;
}

export class LiveBodyDoublingController {
  static async paymentInfo(_req: Request, res: Response): Promise<void> {
    res.json({ success: true, amount: config.liveBodyDoubling.amount, currency: config.liveBodyDoubling.currency, qrImageUrl: '/api/live-body-doubling/payment-qr', upiId: config.liveBodyDoubling.upiId });
  }

  static async paymentQr(_req: Request, res: Response): Promise<void> {
    if (!config.liveBodyDoubling.qrImageUrl) {
      res.status(404).json({ success: false, message: 'UPI QR code is not configured.' });
      return;
    }

    try {
      const upstream = await fetch(config.liveBodyDoubling.qrImageUrl);
      if (!upstream.ok) {
        res.status(502).json({ success: false, message: 'Unable to load the configured UPI QR code.' });
        return;
      }

      const contentType = upstream.headers.get('content-type') || 'image/jpeg';
      if (!contentType.startsWith('image/')) {
        res.status(502).json({ success: false, message: 'The configured UPI QR URL did not return an image.' });
        return;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.send(Buffer.from(await upstream.arrayBuffer()));
    } catch (err) {
      console.error('UPI QR proxy error:', err);
      res.status(502).json({ success: false, message: 'Unable to load the configured UPI QR code.' });
    }
  }

  static async getEntitlement(req: Request, res: Response): Promise<void> {
    const userId = requireUser(req, res); if (!userId) return;
    const approved = await hasAccess(userId);
    const pending = Boolean(await LiveBodyDoublingPayment.exists({ userId, product: 'live_body_doubling', status: 'pending' }));
    res.json({ success: true, approved, pending });
  }

  static async submitPayment(req: Request, res: Response): Promise<void> {
    const userId = requireUser(req, res); if (!userId) return;
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, message: parsed.error.errors[0].message }); return; }
    if (await hasAccess(userId)) { res.status(409).json({ success: false, message: 'Live Body Doubling access is already active.' }); return; }
    try {
      const payment = await LiveBodyDoublingPayment.create({ userId, product: 'live_body_doubling', amount: config.liveBodyDoubling.amount, currency: 'INR', paymentMethod: 'UPI_QR', utr: parsed.data.utr, status: 'pending' });
      res.status(201).json({ success: true, payment: { id: payment._id, status: payment.status }, message: 'Your payment is awaiting verification.' });
    } catch (err: any) {
      if (err?.code === 11000) { res.status(409).json({ success: false, message: 'This UTR has already been submitted.' }); return; }
      console.error('Payment submission error:', err?.message || err);
      res.status(500).json({ success: false, message: 'Payment could not be submitted.' });
    }
  }

  static async getActiveSession(req: Request, res: Response): Promise<void> {
    const userId = requireUser(req, res); if (!userId) return;
    if (req.user?.role !== 'admin' && !(await hasAccess(userId))) { res.status(403).json({ success: false, message: 'Unlock Live Body Doubling to join.' }); return; }
    const session = await LiveBodyDoublingSession.findOne({ active: true, status: 'active' }).sort({ startedAt: -1 });
    if (!session) { res.status(404).json({ success: false, message: 'No live session is currently available.' }); return; }
    res.json({ success: true, session: { id: session._id, sessionId: session.sessionId, roomName: session.roomName, startedAt: session.startedAt, status: session.status } });
  }

  static async createSession(req: Request, res: Response): Promise<void> {
    const userId = requireUser(req, res); if (!userId) return;
    const current = await LiveBodyDoublingSession.findOne({ active: true, status: 'active' });
    if (current) { res.status(409).json({ success: false, message: 'A live session is already active.' }); return; }
    const session = await LiveBodyDoublingSession.create({ sessionId: crypto.randomUUID(), roomName: `neurosage-live-${crypto.randomBytes(12).toString('hex')}`, createdBy: userId, participants: [userId] });
    res.status(201).json({ success: true, session });
  }

  static async joinSession(req: Request, res: Response): Promise<void> {
    const userId = requireUser(req, res); if (!userId) return;
    const session = await LiveBodyDoublingSession.findOne({ _id: req.params.id, active: true, status: 'active' });
    if (!session) { res.status(404).json({ success: false, message: 'No live session is currently available.' }); return; }
    if (req.user?.role !== 'admin' && !(await hasAccess(userId))) { res.status(403).json({ success: false, message: 'Unlock Live Body Doubling to join.' }); return; }
    await LiveBodyDoublingSession.updateOne({ _id: session._id }, { $addToSet: { participants: userId } });
    const checklist = await BodyDoublingSession.findOne({ user: userId, isCompleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, roomName: session.roomName, checklist });
  }

  static async leaveSession(req: Request, res: Response): Promise<void> {
    const userId = requireUser(req, res); if (!userId) return;
    await LiveBodyDoublingSession.updateOne({ _id: req.params.id }, { $pull: { participants: userId } });
    res.json({ success: true });
  }

  static async listPayments(_req: Request, res: Response): Promise<void> {
    const payments = await LiveBodyDoublingPayment.find({ product: 'live_body_doubling', status: 'pending' }).populate('userId', 'name email').sort({ submittedAt: 1 });
    res.json({ success: true, payments });
  }

  static async verifyPayment(req: Request, res: Response): Promise<void> {
    const adminId = requireUser(req, res); if (!adminId) return;
    const payment = await LiveBodyDoublingPayment.findOne({ _id: req.params.id, status: 'pending' });
    if (!payment) { res.status(404).json({ success: false, message: 'Pending payment not found.' }); return; }
    payment.status = 'approved'; payment.verifiedAt = new Date(); payment.verifiedBy = new Types.ObjectId(adminId); await payment.save();
    res.json({ success: true, message: 'Payment approved. Live Body Doubling access is now active.' });
  }

  static async rejectPayment(req: Request, res: Response): Promise<void> {
    const adminId = requireUser(req, res); if (!adminId) return;
    const payment = await LiveBodyDoublingPayment.findOne({ _id: req.params.id, status: 'pending' });
    if (!payment) { res.status(404).json({ success: false, message: 'Pending payment not found.' }); return; }
    payment.status = 'rejected'; payment.rejectionReason = String(req.body?.reason || 'Payment could not be verified').trim().slice(0, 300); payment.verifiedAt = new Date(); payment.verifiedBy = new Types.ObjectId(adminId); await payment.save();
    res.json({ success: true, message: 'Payment rejected.' });
  }

  static async listSessions(_req: Request, res: Response): Promise<void> {
    const sessions = await LiveBodyDoublingSession.find({ active: true }).populate('participants', 'name').sort({ startedAt: -1 });
    res.json({ success: true, sessions });
  }

  static async endSession(req: Request, res: Response): Promise<void> {
    await LiveBodyDoublingSession.updateOne({ _id: req.params.id, active: true }, { $set: { active: false, status: 'ended', endedAt: new Date() } });
    res.json({ success: true });
  }
}
