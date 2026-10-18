import mongoose, { Document, Schema, Types } from 'mongoose';

export type LivePaymentStatus = 'pending' | 'approved' | 'rejected';

export interface ILiveBodyDoublingPayment extends Document {
  userId: Types.ObjectId;
  product: 'live_body_doubling';
  amount: number;
  currency: 'INR';
  paymentMethod: 'UPI_QR';
  utr: string;
  status: LivePaymentStatus;
  submittedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
  rejectionReason?: string;
}

const schema = new Schema<ILiveBodyDoublingPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  product: { type: String, enum: ['live_body_doubling'], required: true },
  amount: { type: Number, required: true, immutable: true },
  currency: { type: String, enum: ['INR'], required: true, immutable: true },
  paymentMethod: { type: String, enum: ['UPI_QR'], required: true, immutable: true },
  utr: { type: String, required: true, unique: true, trim: true, index: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: String,
}, { timestamps: true });

export const LiveBodyDoublingPayment = mongoose.model<ILiveBodyDoublingPayment>('LiveBodyDoublingPayment', schema);
