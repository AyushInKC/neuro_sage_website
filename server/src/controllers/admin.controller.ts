import { Request, Response } from 'express';
import fs from 'fs';
import { Registration } from '../models/Registration.js';
import { Camp } from '../models/Camp.js';
import { FCFSQueueService } from '../services/fcfsQueue.service.js';
import { StorageService } from '../services/storage.service.js';
import { config } from '../config/index.js';

export class AdminController {
  /**
   * Retrieves all registrations in strict queue order (sequence number ascending).
   */
  public static async getRegistrations(req: Request, res: Response): Promise<void> {
    try {
      const { status, search } = req.query;

      const query: any = {};
      if (status && status !== 'ALL') {
        query.registrationStatus = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        query.$or = [{ fullName: regex }, { email: regex }, { reference: regex }, { collegeName: regex }];
      }

      const registrations = await Registration.find(query)
        .populate('user', 'name email')
        .sort({ sequenceNumber: 1 });

      const camp = await Camp.findOne({ campCode: config.camp.code });

      res.status(200).json({
        success: true,
        total: registrations.length,
        campCapacity: camp?.capacity || 50,
        registrations,
      });
    } catch (err: any) {
      console.error('Admin getRegistrations error:', err);
      res.status(500).json({ success: false, message: 'Failed to load registrations' });
    }
  }

  /**
   * Admin verifies payment and triggers automatic FCFS seat allocation or waitlist.
   */
  public static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Admin authentication required' });
        return;
      }

      const updated = await FCFSQueueService.verifyPayment(id, req.user.id, req.user.name);

      res.status(200).json({
        success: true,
        message:
          updated.registrationStatus === 'CONFIRMED'
            ? `Payment verified. Seat #${updated.allocatedSeatNumber} allocated to participant.`
            : 'Payment verified. Participant added to waitlist (camp currently at capacity).',
        registration: updated,
      });
    } catch (err: any) {
      console.error('Admin verifyPayment error:', err);
      res.status(400).json({ success: false, message: err.message || 'Verification failed' });
    }
  }

  /**
   * Admin rejects payment with mandatory reason.
   */
  public static async rejectPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length === 0) {
        res.status(400).json({ success: false, message: 'A rejection reason is required' });
        return;
      }

      if (!req.user) {
        res.status(401).json({ success: false, message: 'Admin authentication required' });
        return;
      }

      const updated = await FCFSQueueService.rejectPayment(
        id,
        req.user.id,
        req.user.name,
        reason.trim()
      );

      res.status(200).json({
        success: true,
        message: 'Payment rejected. Status updated and waitlist reviewed.',
        registration: updated,
      });
    } catch (err: any) {
      console.error('Admin rejectPayment error:', err);
      res.status(400).json({ success: false, message: err.message || 'Rejection failed' });
    }
  }

  /**
   * Admin cancels registration with mandatory audit reason.
   */
  public static async cancelRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length === 0) {
        res.status(400).json({ success: false, message: 'A cancellation reason is required' });
        return;
      }

      if (!req.user) {
        res.status(401).json({ success: false, message: 'Admin authentication required' });
        return;
      }

      const updated = await FCFSQueueService.cancelRegistration(
        id,
        req.user.id,
        req.user.name,
        'admin',
        reason.trim()
      );

      res.status(200).json({
        success: true,
        message: 'Registration cancelled and earliest eligible waitlisted participant promoted.',
        registration: updated,
      });
    } catch (err: any) {
      console.error('Admin cancelRegistration error:', err);
      res.status(400).json({ success: false, message: err.message || 'Cancellation failed' });
    }
  }

  /**
   * Securely streams uploaded payment slip to authorized admin only.
   */
  public static async getPaymentSlip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const registration = await Registration.findById(id);

      if (!registration || !registration.paymentSlip?.filename) {
        res.status(404).json({ success: false, message: 'Payment slip not found' });
        return;
      }

      const filePath = StorageService.getFilePath(registration.paymentSlip.filename);

      res.setHeader('Content-Type', registration.paymentSlip.mimeType);
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${registration.paymentSlip.originalName}"`
      );

      const stream = fs.createReadStream(filePath);
      stream.on('error', (err) => {
        console.error('File stream error:', err);
        res.status(500).json({ success: false, message: 'Error reading payment slip' });
      });

      stream.pipe(res);
    } catch (err: any) {
      console.error('Admin getPaymentSlip error:', err);
      res.status(404).json({ success: false, message: 'Payment slip not found or inaccessible' });
    }
  }

  /**
   * Updates camp configuration (capacity, open status, dates, venue).
   */
  public static async updateCampConfig(req: Request, res: Response): Promise<void> {
    try {
      const { capacity, isOpen, venue, dates, waitlistEnabled } = req.body;

      let camp = await Camp.findOne({ campCode: config.camp.code });
      if (!camp) {
        res.status(404).json({ success: false, message: 'Camp not found' });
        return;
      }

      if (typeof capacity === 'number' && capacity > 0) {
        camp.capacity = capacity;
      }
      if (typeof isOpen === 'boolean') {
        camp.isOpen = isOpen;
      }
      if (typeof waitlistEnabled === 'boolean') {
        camp.waitlistEnabled = waitlistEnabled;
      }
      if (venue) {
        camp.venue = venue;
      }
      if (dates) {
        camp.dates = dates;
      }

      await camp.save();

      // Check if increasing capacity allows promoting waitlisted users
      if (req.user) {
        await FCFSQueueService.promoteEarliestWaitlisted(
          (camp._id as any).toString(),
          req.user.id,
          req.user.name
        );
      }

      res.status(200).json({
        success: true,
        message: 'Camp settings updated successfully.',
        camp,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to update camp settings' });
    }
  }

  /**
   * System & queue statistics for admin dashboard.
   */
  public static async getAdminStats(req: Request, res: Response): Promise<void> {
    try {
      const camp = await Camp.findOne({ campCode: config.camp.code });
      const campId = camp?._id;

      const total = await Registration.countDocuments({ camp: campId });
      const confirmed = await Registration.countDocuments({
        camp: campId,
        registrationStatus: 'CONFIRMED',
      });
      const pending = await Registration.countDocuments({
        camp: campId,
        registrationStatus: 'PENDING_PAYMENT_VERIFICATION',
      });
      const waitlisted = await Registration.countDocuments({
        camp: campId,
        registrationStatus: 'WAITLISTED',
      });
      const rejected = await Registration.countDocuments({
        camp: campId,
        registrationStatus: 'PAYMENT_REJECTED',
      });
      const cancelled = await Registration.countDocuments({
        camp: campId,
        registrationStatus: 'CANCELLED',
      });

      res.status(200).json({
        success: true,
        stats: {
          capacity: camp?.capacity || 50,
          total,
          confirmed,
          pending,
          waitlisted,
          rejected,
          cancelled,
          availableSeats: Math.max(0, (camp?.capacity || 50) - confirmed),
          isOpen: camp?.isOpen ?? true,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to load stats' });
    }
  }
}
