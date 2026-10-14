import { Types } from 'mongoose';
import { Registration, IRegistration, RegistrationStatus, PaymentStatus } from '../models/Registration.js';
import { Camp } from '../models/Camp.js';
import { getNextSequenceValue } from '../models/Counter.js';

export interface CreateRegistrationParams {
  userId: string | Types.ObjectId;
  campId: string | Types.ObjectId;
  fullName: string;
  email: string;
  collegeName: string;
  collegeYear: 'First year' | 'Second year' | 'Third year' | 'Fourth year' | 'Other';
  paymentSlip: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
}

export class FCFSQueueService {
  /**
   * Creates a new registration in strict FCFS sequence.
   */
  public static async createRegistration(
    params: CreateRegistrationParams
  ): Promise<IRegistration> {
    const camp = await Camp.findById(params.campId);
    if (!camp) {
      throw new Error('Specified camp event was not found');
    }

    if (!camp.isOpen) {
      throw new Error('Registration for this camp is currently closed');
    }

    // Check for existing registration by this user for this camp
    const existing = await Registration.findOne({
      user: params.userId,
      camp: params.campId,
    });

    if (existing) {
      throw new Error('You have already submitted a registration for this camp');
    }

    // Allocate atomic, monotonic sequence number
    const seq = await getNextSequenceValue(`camp_${camp.campCode}_seq`);
    const reference = `NS-${camp.campCode.substring(0, 2)}-${String(seq).padStart(4, '0')}`;

    const registration = new Registration({
      reference,
      sequenceNumber: seq,
      user: params.userId,
      camp: params.campId,
      fullName: params.fullName,
      email: params.email,
      collegeName: params.collegeName,
      collegeYear: params.collegeYear,
      paymentStatus: 'PENDING_VERIFICATION',
      registrationStatus: 'PENDING_PAYMENT_VERIFICATION',
      allocatedSeatNumber: null,
      paymentSlip: {
        ...params.paymentSlip,
        uploadedAt: new Date(),
      },
      auditLog: [
        {
          action: 'REGISTRATION_SUBMITTED',
          performedBy: new Types.ObjectId(params.userId),
          performerRole: 'user',
          timestamp: new Date(),
          notes: `Registration submitted with sequence #${seq}. Awaiting payment verification.`,
          newStatus: 'PENDING_PAYMENT_VERIFICATION',
        },
      ],
    });

    await registration.save();
    return registration;
  }

  /**
   * Admin verifies payment and triggers seat allocation or waitlisting according to FCFS rules.
   */
  public static async verifyPayment(
    registrationId: string,
    adminId: string,
    adminName: string
  ): Promise<IRegistration> {
    const registration = await Registration.findById(registrationId).populate('camp');
    if (!registration) {
      throw new Error('Registration not found');
    }

    if (registration.paymentStatus === 'VERIFIED') {
      return registration;
    }

    const camp = await Camp.findById(registration.camp);
    if (!camp) {
      throw new Error('Camp not found');
    }

    // Check currently confirmed seats
    const confirmedCount = await Registration.countDocuments({
      camp: camp._id,
      registrationStatus: 'CONFIRMED',
    });

    const previousStatus = registration.registrationStatus;
    let newStatus: RegistrationStatus = 'CONFIRMED';
    let seatNumber: number | null = null;

    if (confirmedCount < camp.capacity) {
      // Find the next seat number (1 to capacity)
      const confirmedRegs = await Registration.find({
        camp: camp._id,
        registrationStatus: 'CONFIRMED',
        allocatedSeatNumber: { $ne: null },
      }).select('allocatedSeatNumber');

      const takenSeats = new Set(confirmedRegs.map((r) => r.allocatedSeatNumber));
      for (let s = 1; s <= camp.capacity; s++) {
        if (!takenSeats.has(s)) {
          seatNumber = s;
          break;
        }
      }
      newStatus = 'CONFIRMED';
    } else {
      if (camp.waitlistEnabled) {
        newStatus = 'WAITLISTED';
      } else {
        throw new Error('Camp is at full capacity and waitlisting is disabled.');
      }
    }

    registration.paymentStatus = 'VERIFIED';
    registration.registrationStatus = newStatus;
    registration.allocatedSeatNumber = seatNumber;

    registration.auditLog.push({
      action: 'PAYMENT_VERIFIED',
      performedBy: new Types.ObjectId(adminId),
      performerName: adminName,
      performerRole: 'admin',
      timestamp: new Date(),
      notes:
        newStatus === 'CONFIRMED'
          ? `Payment verified. Confirmed seat #${seatNumber} allocated.`
          : 'Payment verified. Placed in waitlist due to capacity.',
      previousStatus,
      newStatus,
    });

    await registration.save();
    return registration;
  }

  /**
   * Admin rejects payment with a reason.
   */
  public static async rejectPayment(
    registrationId: string,
    adminId: string,
    adminName: string,
    reason: string
  ): Promise<IRegistration> {
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      throw new Error('Registration not found');
    }

    const previousStatus = registration.registrationStatus;
    const wasConfirmed = previousStatus === 'CONFIRMED';

    registration.paymentStatus = 'REJECTED';
    registration.registrationStatus = 'PAYMENT_REJECTED';
    registration.rejectionReason = reason;
    registration.allocatedSeatNumber = null;

    registration.auditLog.push({
      action: 'PAYMENT_REJECTED',
      performedBy: new Types.ObjectId(adminId),
      performerName: adminName,
      performerRole: 'admin',
      timestamp: new Date(),
      notes: `Payment rejected. Reason: ${reason}`,
      previousStatus,
      newStatus: 'PAYMENT_REJECTED',
    });

    await registration.save();

    // If this had a confirmed seat, promote earliest waitlisted
    if (wasConfirmed) {
      await this.promoteEarliestWaitlisted(registration.camp.toString(), adminId, adminName);
    }

    return registration;
  }

  /**
   * Admin or user cancels registration.
   */
  public static async cancelRegistration(
    registrationId: string,
    performerId: string,
    performerName: string,
    performerRole: 'admin' | 'user',
    reason: string
  ): Promise<IRegistration> {
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      throw new Error('Registration not found');
    }

    const previousStatus = registration.registrationStatus;
    const wasConfirmed = previousStatus === 'CONFIRMED';

    registration.registrationStatus = 'CANCELLED';
    registration.cancellationReason = reason;
    registration.allocatedSeatNumber = null;

    registration.auditLog.push({
      action: 'REGISTRATION_CANCELLED',
      performedBy: new Types.ObjectId(performerId),
      performerName,
      performerRole,
      timestamp: new Date(),
      notes: `Registration cancelled. Reason: ${reason}`,
      previousStatus,
      newStatus: 'CANCELLED',
    });

    await registration.save();

    if (wasConfirmed) {
      await this.promoteEarliestWaitlisted(registration.camp.toString(), performerId, performerName);
    }

    return registration;
  }

  /**
   * Promotes the earliest eligible waitlisted participant (lowest sequence number) to CONFIRMED.
   */
  public static async promoteEarliestWaitlisted(
    campId: string,
    triggerAdminId?: string,
    triggerAdminName?: string
  ): Promise<IRegistration | null> {
    const camp = await Camp.findById(campId);
    if (!camp) return null;

    const confirmedCount = await Registration.countDocuments({
      camp: camp._id,
      registrationStatus: 'CONFIRMED',
    });

    if (confirmedCount >= camp.capacity) {
      return null;
    }

    // Find earliest waitlisted participant with verified payment
    const earliestWaitlisted = await Registration.findOne({
      camp: camp._id,
      registrationStatus: 'WAITLISTED',
      paymentStatus: 'VERIFIED',
    }).sort({ sequenceNumber: 1 });

    if (!earliestWaitlisted) {
      return null;
    }

    // Find available seat number
    const confirmedRegs = await Registration.find({
      camp: camp._id,
      registrationStatus: 'CONFIRMED',
      allocatedSeatNumber: { $ne: null },
    }).select('allocatedSeatNumber');

    const takenSeats = new Set(confirmedRegs.map((r) => r.allocatedSeatNumber));
    let nextSeat = 1;
    for (let s = 1; s <= camp.capacity; s++) {
      if (!takenSeats.has(s)) {
        nextSeat = s;
        break;
      }
    }

    const previousStatus = earliestWaitlisted.registrationStatus;
    earliestWaitlisted.registrationStatus = 'CONFIRMED';
    earliestWaitlisted.allocatedSeatNumber = nextSeat;

    earliestWaitlisted.auditLog.push({
      action: 'WAITLIST_PROMOTION',
      performedBy: triggerAdminId ? new Types.ObjectId(triggerAdminId) : undefined,
      performerName: triggerAdminName || 'System FCFS Engine',
      performerRole: 'admin',
      timestamp: new Date(),
      notes: `Promoted from waitlist into confirmed seat #${nextSeat} based on FCFS sequence #${earliestWaitlisted.sequenceNumber}.`,
      previousStatus,
      newStatus: 'CONFIRMED',
    });

    await earliestWaitlisted.save();
    return earliestWaitlisted;
  }

  /**
   * Calculates current queue position and waitlist index for a registration.
   */
  public static async getQueueStats(registration: IRegistration): Promise<{
    queuePosition: number;
    waitlistPosition: number | null;
    totalInQueue: number;
    confirmedSeats: number;
    capacity: number;
  }> {
    const camp = await Camp.findById(registration.camp);
    const capacity = camp?.capacity || 50;

    const confirmedSeats = await Registration.countDocuments({
      camp: registration.camp,
      registrationStatus: 'CONFIRMED',
    });

    // Total registrations before this sequence number
    const queuePosition = await Registration.countDocuments({
      camp: registration.camp,
      sequenceNumber: { $lte: registration.sequenceNumber },
      registrationStatus: { $in: ['PENDING_PAYMENT_VERIFICATION', 'CONFIRMED', 'WAITLISTED'] },
    });

    const totalInQueue = await Registration.countDocuments({
      camp: registration.camp,
      registrationStatus: { $in: ['PENDING_PAYMENT_VERIFICATION', 'CONFIRMED', 'WAITLISTED'] },
    });

    let waitlistPosition: number | null = null;
    if (registration.registrationStatus === 'WAITLISTED') {
      waitlistPosition = await Registration.countDocuments({
        camp: registration.camp,
        registrationStatus: 'WAITLISTED',
        sequenceNumber: { $lte: registration.sequenceNumber },
      });
    }

    return {
      queuePosition,
      waitlistPosition,
      totalInQueue,
      confirmedSeats,
      capacity,
    };
  }
}
