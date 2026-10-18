import mongoose, { Document, Schema, Types } from 'mongoose';

export type LiveSessionStatus = 'active' | 'ended';

export interface ILiveBodyDoublingSession extends Document {
  sessionId: string;
  roomName: string;
  status: LiveSessionStatus;
  createdBy: Types.ObjectId;
  createdAt: Date;
  startedAt: Date;
  endedAt?: Date;
  participants: Types.ObjectId[];
  active: boolean;
}

const schema = new Schema<ILiveBodyDoublingSession>({
  sessionId: { type: String, required: true, unique: true, index: true },
  roomName: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'ended'], default: 'active', index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

export const LiveBodyDoublingSession = mongoose.model<ILiveBodyDoublingSession>('LiveBodyDoublingSession', schema);
