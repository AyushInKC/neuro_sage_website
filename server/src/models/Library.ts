import mongoose, { Document, Schema } from 'mongoose';

export interface ILibraryBook extends Document {
  bookName: string;
  price: number;
  buyLink: string;
  imageFilename: string;
  imageMimeType: string;
  createdAt: Date;
}

export interface IQuote extends Document {
  text: string;
  author?: string;
  createdAt: Date;
}

const BookSchema = new Schema<ILibraryBook>({
  bookName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  buyLink: { type: String, required: true, trim: true },
  imageFilename: { type: String, required: true },
  imageMimeType: { type: String, required: true },
}, { timestamps: true });

const QuoteSchema = new Schema<IQuote>({
  text: { type: String, required: true, trim: true },
  author: { type: String, trim: true },
}, { timestamps: true });

export const LibraryBook = mongoose.model<ILibraryBook>('LibraryBook', BookSchema);
export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);
