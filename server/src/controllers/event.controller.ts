import { Request, Response } from 'express';
import fs from 'fs';
import { z } from 'zod';
import { Event } from '../models/Event.js';
import { StorageService } from '../services/storage.service.js';

const eventSchema = z.object({
  eventName: z.string().min(2, 'Event name is required'),
  registrationFee: z.coerce.number().min(0, 'Registration fee cannot be negative'),
  location: z.string().min(2, 'Location is required'),
  mode: z.enum(['virtual', 'live']),
});

function serializeEvent(event: any) {
  return {
    id: event._id,
    eventName: event.eventName,
    registrationFee: event.registrationFee,
    location: event.location,
    mode: event.mode,
    posterUrl: `/api/events/posters/${encodeURIComponent(event.posterFilename)}`,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export class EventController {
  public static async list(_req: Request, res: Response): Promise<void> {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      res.json({ success: true, events: events.map(serializeEvent) });
    } catch (err) {
      console.error('List events error:', err);
      res.status(500).json({ success: false, message: 'Failed to load events' });
    }
  }

  public static async poster(req: Request, res: Response): Promise<void> {
    try {
      const event = await Event.findOne({ posterFilename: req.params.filename });
      if (!event) {
        res.status(404).json({ success: false, message: 'Event poster not found' });
        return;
      }
      const filePath = StorageService.getEventPosterPath(event.posterFilename);
      res.type(event.posterMimeType);
      fs.createReadStream(filePath).on('error', () => {
        if (!res.headersSent) res.status(404).json({ success: false, message: 'Event poster not found' });
      }).pipe(res);
    } catch (err) {
      console.error('Read event poster error:', err);
      res.status(404).json({ success: false, message: 'Event poster not found' });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const parsed = eventSchema.safeParse(req.body);
      if (!parsed.success || !req.file) {
        const message = !req.file
          ? 'Please upload an event poster.'
          : parsed.success
            ? 'Invalid event data.'
            : parsed.error.errors[0]?.message || 'Invalid event data.';
        res.status(400).json({
          success: false,
          message,
        });
        return;
      }
      const poster = await StorageService.saveEventPoster(req.file.buffer, req.file.originalname);
      const event = await Event.create({
        ...parsed.data,
        posterFilename: poster.storedFilename,
        posterMimeType: poster.mimeType,
        posterOriginalName: poster.originalName,
      });
      res.status(201).json({ success: true, event: serializeEvent(event) });
    } catch (err: any) {
      console.error('Create event error:', err);
      res.status(400).json({ success: false, message: err.message || 'Failed to create event' });
    }
  }

  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const parsed = eventSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: parsed.error.errors[0]?.message });
        return;
      }
      const event = await Event.findById(req.params.id);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }
      Object.assign(event, parsed.data);
      if (req.file) {
        const poster = await StorageService.saveEventPoster(req.file.buffer, req.file.originalname);
        event.posterFilename = poster.storedFilename;
        event.posterMimeType = poster.mimeType;
        event.posterOriginalName = poster.originalName;
      }
      await event.save();
      res.json({ success: true, event: serializeEvent(event) });
    } catch (err: any) {
      console.error('Update event error:', err);
      res.status(400).json({ success: false, message: err.message || 'Failed to update event' });
    }
  }

  public static async remove(req: Request, res: Response): Promise<void> {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }
      await StorageService.deleteEventPoster(event.posterFilename);
      res.json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
      console.error('Delete event error:', err);
      res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
  }
}
