import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface IBodyDoublingSession extends Document {
  user: Types.ObjectId;
  intention: string;
  tasks: ITaskItem[];
  durationMinutes: number;
  soundAmbience: string;
  reflectionNotes?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskItemSchema = new Schema<ITaskItem>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const BodyDoublingSessionSchema = new Schema<IBodyDoublingSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    intention: {
      type: String,
      default: '',
    },
    tasks: [TaskItemSchema],
    durationMinutes: {
      type: Number,
      default: 25,
    },
    soundAmbience: {
      type: String,
      default: 'none',
    },
    reflectionNotes: {
      type: String,
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const BodyDoublingSession = mongoose.model<IBodyDoublingSession>(
  'BodyDoublingSession',
  BodyDoublingSessionSchema
);
