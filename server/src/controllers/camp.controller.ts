import { Request, Response } from 'express';
import { z } from 'zod';
import { Camp } from '../models/Camp.js';
import { Registration } from '../models/Registration.js';
import { FCFSQueueService } from '../services/fcfsQueue.service.js';
import { StorageService } from '../services/storage.service.js';
import { config } from '../config/index.js';

const campRegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  collegeName: z.string().min(2, 'College/institution name is required'),
  collegeYear: z.enum([
    'First year',
    'Second year',
    'Third year',
    'Fourth year',
    'Other',
  ]),
});

export class CampController {
  /**
   * Returns details for Brainwell Camp.
   */
  public static async getCampInfo(req: Request, res: Response): Promise<void> {
    try {
      let camp = await Camp.findOne({ campCode: config.camp.code });
      if (!camp) {
        // Initialize default Brainwell Camp configuration
        camp = await Camp.create({
          campCode: config.camp.code,
          title: config.camp.title,
          tagline: config.camp.tagline,
          fee: config.camp.fee,
          capacity: config.camp.defaultCapacity,
          isOpen: true,
          waitlistEnabled: true,
          venue: 'Details to be announced',
          dates: 'Details to be announced',
          description:
            'Make space to pause, reconnect, and care for your mind. Brainwell Camp is a NeuroSage initiative designed to encourage mental-wellness awareness, mindful habits, and supportive conversations.',
        });
      }

      const confirmedCount = await Registration.countDocuments({
        camp: camp._id,
        registrationStatus: 'CONFIRMED',
      });

      const waitlistedCount = await Registration.countDocuments({
        camp: camp._id,
        registrationStatus: 'WAITLISTED',
      });

      const pendingCount = await Registration.countDocuments({
        camp: camp._id,
        registrationStatus: 'PENDING_PAYMENT_VERIFICATION',
      });

      res.status(200).json({
        success: true,
        camp: {
          id: camp._id,
          campCode: camp.campCode,
          title: camp.title,
          tagline: camp.tagline,
          fee: camp.fee,
          capacity: camp.capacity,
          confirmedCount,
          waitlistedCount,
          pendingCount,
          isOpen: camp.isOpen,
          venue: camp.venue,
          dates: camp.dates,
          description: camp.description,
        },
      });
    } catch (err: any) {
      console.error('getCampInfo error:', err);
      res.status(500).json({ success: false, message: 'Failed to load camp information' });
    }
  }

  /**
   * Registers an authenticated user for Brainwell Camp with payment slip upload.
   */
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Please upload your payment slip (PDF, JPG, or PNG up to 5MB).',
        });
        return;
      }

      const parsed = campRegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.errors[0]?.message || 'Invalid registration data',
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      let camp = await Camp.findOne({ campCode: config.camp.code });
      if (!camp) {
        res.status(404).json({ success: false, message: 'Camp event not found' });
        return;
      }

      // Check existing registration
      const existing = await Registration.findOne({
        user: req.user.id,
        camp: camp._id,
      });

      if (existing) {
        res.status(400).json({
          success: false,
          message:
            'You have already registered for Brainwell Camp. View status in My Registrations.',
          registrationId: existing._id,
        });
        return;
      }

      // Validate magic bytes and store securely in private storage
      const savedSlip = await StorageService.savePaymentSlip(file.buffer, file.originalname);

      // Register in strict FCFS sequence
      const registration = await FCFSQueueService.createRegistration({
        userId: req.user.id,
        campId: (camp._id as any).toString(),
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        collegeName: parsed.data.collegeName,
        collegeYear: parsed.data.collegeYear,
        paymentSlip: {
          filename: savedSlip.storedFilename,
          originalName: savedSlip.originalName,
          mimeType: savedSlip.mimeType,
          size: savedSlip.size,
        },
      });

      const stats = await FCFSQueueService.getQueueStats(registration);

      res.status(201).json({
        success: true,
        message:
          'Your Brainwell Camp registration has been received. Your payment slip is awaiting verification.',
        registration: {
          id: registration._id,
          reference: registration.reference,
          sequenceNumber: registration.sequenceNumber,
          fullName: registration.fullName,
          email: registration.email,
          collegeName: registration.collegeName,
          collegeYear: registration.collegeYear,
          paymentStatus: registration.paymentStatus,
          registrationStatus: registration.registrationStatus,
          createdAt: registration.createdAt,
          queueStats: stats,
        },
      });
    } catch (err: any) {
      console.error('Camp registration error:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'Registration failed. Please try again.',
      });
    }
  }

  /**
   * Retrieves current user's registration details and queue position.
   */
  public static async getMyRegistrations(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const registrations = await Registration.find({ user: req.user.id })
        .populate('camp')
        .sort({ createdAt: -1 });

      const results = await Promise.all(
        registrations.map(async (reg) => {
          const stats = await FCFSQueueService.getQueueStats(reg);
          return {
            id: reg._id,
            reference: reg.reference,
            sequenceNumber: reg.sequenceNumber,
            fullName: reg.fullName,
            email: reg.email,
            collegeName: reg.collegeName,
            collegeYear: reg.collegeYear,
            paymentStatus: reg.paymentStatus,
            registrationStatus: reg.registrationStatus,
            allocatedSeatNumber: reg.allocatedSeatNumber,
            rejectionReason: reg.rejectionReason,
            createdAt: reg.createdAt,
            camp: reg.camp,
            queueStats: stats,
          };
        })
      );

      res.status(200).json({
        success: true,
        registrations: results,
      });
    } catch (err: any) {
      console.error('getMyRegistrations error:', err);
      res.status(500).json({ success: false, message: 'Failed to load registrations' });
    }
  }

  /**
   * Allows user to cancel their registration.
   */
  public static async cancelMyRegistration(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const registration = await Registration.findOne({ _id: id, user: req.user.id });

      if (!registration) {
        res.status(404).json({ success: false, message: 'Registration not found' });
        return;
      }

      if (registration.registrationStatus === 'CANCELLED') {
        res.status(400).json({ success: false, message: 'Registration is already cancelled' });
        return;
      }

      const reason = req.body.reason || 'Cancelled by user';
      const updated = await FCFSQueueService.cancelRegistration(
        (registration._id as any).toString(),
        req.user.id,
        req.user.name,
        'user',
        reason
      );

      res.status(200).json({
        success: true,
        message: 'Registration successfully cancelled.',
        registration: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to cancel' });
    }
  }
}
