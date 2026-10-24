import { Request, Response } from 'express';
import fs from 'fs';
import { z } from 'zod';
import { LibraryBook, Quote } from '../models/Library.js';
import { StorageService } from '../services/storage.service.js';

const bookSchema = z.object({
  bookName: z.string().min(2),
  price: z.coerce.number().min(0),
  buyLink: z.string().url(),
});
const quoteSchema = z.object({ text: z.string().min(2), author: z.string().optional() });

const serializeBook = (book: any) => ({
  id: book._id, bookName: book.bookName, price: book.price, buyLink: book.buyLink,
  imageUrl: `/api/library/books/images/${encodeURIComponent(book.imageFilename)}`,
  createdAt: book.createdAt,
});

export class LibraryController {
  public static async list(_req: Request, res: Response): Promise<void> {
    try {
      const [books, quotes] = await Promise.all([
        LibraryBook.find().sort({ createdAt: -1 }),
        Quote.find().sort({ createdAt: -1 }),
      ]);
      res.json({ success: true, books: books.map(serializeBook), quotes });
    } catch (err) {
      console.error('List library error:', err);
      res.status(500).json({ success: false, message: 'Failed to load library' });
    }
  }

  public static async image(req: Request, res: Response): Promise<void> {
    try {
      const book = await LibraryBook.findOne({ imageFilename: req.params.filename });
      if (!book) { res.status(404).end(); return; }
      const filePath = StorageService.getLibraryBookImagePath(book.imageFilename);
      res.type(book.imageMimeType);
      fs.createReadStream(filePath).pipe(res);
    } catch { res.status(404).end(); }
  }

  public static async createBook(req: Request, res: Response): Promise<void> {
    try {
      const parsed = bookSchema.safeParse(req.body);
      if (!parsed.success || !req.file) {
        res.status(400).json({ success: false, message: !req.file ? 'Book image is required.' : 'Invalid book details.' });
        return;
      }
      const image = await StorageService.saveLibraryBookImage(req.file.buffer, req.file.originalname);
      const book = await LibraryBook.create({ ...parsed.data, imageFilename: image.storedFilename, imageMimeType: image.mimeType });
      res.status(201).json({ success: true, book: serializeBook(book) });
    } catch (err: any) { res.status(400).json({ success: false, message: err.message || 'Failed to create book' }); }
  }

  public static async deleteBook(req: Request, res: Response): Promise<void> {
    const book = await LibraryBook.findByIdAndDelete(req.params.id);
    if (!book) { res.status(404).json({ success: false, message: 'Book not found' }); return; }
    await StorageService.deleteLibraryBookImage(book.imageFilename);
    res.json({ success: true });
  }

  public static async createQuote(req: Request, res: Response): Promise<void> {
    const parsed = quoteSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, message: 'Quote text is required.' }); return; }
    const quote = await Quote.create(parsed.data);
    res.status(201).json({ success: true, quote });
  }

  public static async deleteQuote(req: Request, res: Response): Promise<void> {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) { res.status(404).json({ success: false, message: 'Quote not found' }); return; }
    res.json({ success: true });
  }
}
