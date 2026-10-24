import mongoose, { Document, Schema } from 'mongoose';

export type EventMode = 'virtual' | 'live';

export interface IEvent extends Document {
  eventName: string;
  registrationFee: number;
  location: string;
  mode: EventMode;
  posterFilename: string;
  posterMimeType: string;
  posterOriginalName: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true, trim: true },
    registrationFee: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['virtual', 'live'], required: true },
    posterFilename: { type: String, required: true },
    posterMimeType: { type: String, required: true },
    posterOriginalName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
