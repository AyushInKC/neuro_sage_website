import mongoose, { Document, Schema } from 'mongoose';

export interface ICamp extends Document {
  campCode: string;
  title: string;
  tagline: string;
  fee: number;
  capacity: number;
  waitlistEnabled: boolean;
  isOpen: boolean;
  venue: string;
  dates: string;
  description: string;
  registrationOpenDate?: Date;
  registrationCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CampSchema = new Schema<ICamp>(
  {
    campCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Brainwell Camp',
    },
    tagline: {
      type: String,
      default: 'Revive your mind.',
    },
    fee: {
      type: Number,
      required: true,
      default: 49,
    },
    capacity: {
      type: Number,
      required: true,
      default: 50,
    },
    waitlistEnabled: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    venue: {
      type: String,
      default: 'Details to be announced',
    },
    dates: {
      type: String,
      default: 'Details to be announced',
    },
    description: {
      type: String,
      default:
        'Make space to pause, reconnect, and care for your mind. Brainwell Camp is a NeuroSage initiative designed to encourage mental-wellness awareness, mindful habits, and supportive conversations.',
    },
    registrationOpenDate: {
      type: Date,
    },
    registrationCloseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Camp = mongoose.model<ICamp>('Camp', CampSchema);
