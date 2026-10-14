import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IChatConversation extends Document {
  user: Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  id: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatConversationSchema = new Schema<IChatConversation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Reflective Space',
    },
    messages: [ChatMessageSchema],
  },
  {
    timestamps: true,
  }
);

export const ChatConversation = mongoose.model<IChatConversation>(
  'ChatConversation',
  ChatConversationSchema
);
