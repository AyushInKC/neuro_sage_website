import mongoose, { Document, Schema, Types } from 'mongoose';

export type PaymentStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
export type RegistrationStatus =
  | 'PENDING_PAYMENT_VERIFICATION'
  | 'CONFIRMED'
  | 'WAITLISTED'
  | 'PAYMENT_REJECTED'
  | 'CANCELLED';

export interface IAuditLogEntry {
  action: string;
  performedBy?: Types.ObjectId;
  performerName?: string;
  performerRole?: string;
  timestamp: Date;
  notes?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface IPaymentSlip {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface IRegistration extends Document {
  reference: string;
  sequenceNumber: number;
  user: Types.ObjectId;
  camp: Types.ObjectId;
  fullName: string;
  email: string;
  collegeName: string;
  collegeYear: 'First year' | 'Second year' | 'Third year' | 'Fourth year' | 'Other';
  paymentStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
  allocatedSeatNumber?: number | null;
  paymentSlip: IPaymentSlip;
  rejectionReason?: string;
  cancellationReason?: string;
  auditLog: IAuditLogEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogEntry>({
  action: { type: String, required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  performerName: { type: String },
  performerRole: { type: String },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String },
  previousStatus: { type: String },
  newStatus: { type: String },
});

const PaymentSlipSchema = new Schema<IPaymentSlip>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const RegistrationSchema = new Schema<IRegistration>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sequenceNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    camp: {
      type: Schema.Types.ObjectId,
      ref: 'Camp',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    collegeYear: {
      type: String,
      required: true,
      enum: ['First year', 'Second year', 'Third year', 'Fourth year', 'Other'],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'],
      default: 'PENDING_VERIFICATION',
      index: true,
    },
    registrationStatus: {
      type: String,
      required: true,
      enum: [
        'PENDING_PAYMENT_VERIFICATION',
        'CONFIRMED',
        'WAITLISTED',
        'PAYMENT_REJECTED',
        'CANCELLED',
      ],
      default: 'PENDING_PAYMENT_VERIFICATION',
      index: true,
    },
    allocatedSeatNumber: {
      type: Number,
      default: null,
    },
    paymentSlip: {
      type: PaymentSlipSchema,
      required: true,
    },
    rejectionReason: {
      type: String,
    },
    cancellationReason: {
      type: String,
    },
    auditLog: [AuditLogSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registrations for the same user and camp
RegistrationSchema.index({ user: 1, camp: 1 }, { unique: true });

export const Registration = mongoose.model<IRegistration>('Registration', RegistrationSchema);
