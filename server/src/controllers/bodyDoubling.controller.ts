import { Request, Response } from 'express';
import { BodyDoublingSession } from '../models/BodyDoublingSession.js';

export class BodyDoublingController {
  /**
   * Retrieves or initializes the user's active body-doubling session.
   */
  public static async getActiveSession(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      let session = await BodyDoublingSession.findOne({
        user: req.user.id,
        isCompleted: false,
      }).sort({ createdAt: -1 });

      if (!session) {
        session = await BodyDoublingSession.create({
          user: req.user.id,
          intention: '',
          tasks: [],
          durationMinutes: 25,
          soundAmbience: 'none',
          isCompleted: false,
        });
      }

      res.status(200).json({
        success: true,
        session,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to load focus session' });
    }
  }

  /**
   * Updates an ongoing focus session (tasks, intention, duration, sound).
   */
  public static async updateSession(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const { intention, tasks, durationMinutes, soundAmbience, reflectionNotes, isCompleted } =
        req.body;

      const session = await BodyDoublingSession.findOne({ _id: id, user: req.user.id });
      if (!session) {
        res.status(404).json({ success: false, message: 'Focus session not found' });
        return;
      }

      if (intention !== undefined) session.intention = intention;
      if (Array.isArray(tasks)) session.tasks = tasks;
      if (typeof durationMinutes === 'number') session.durationMinutes = durationMinutes;
      if (soundAmbience !== undefined) session.soundAmbience = soundAmbience;
      if (reflectionNotes !== undefined) session.reflectionNotes = reflectionNotes;
      if (typeof isCompleted === 'boolean') session.isCompleted = isCompleted;

      await session.save();

      res.status(200).json({
        success: true,
        session,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to update focus session' });
    }
  }

  /**
   * Retrieves past completed sessions.
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const sessions = await BodyDoublingSession.find({
        user: req.user.id,
        isCompleted: true,
      })
        .sort({ updatedAt: -1 })
        .limit(10);

      res.status(200).json({
        success: true,
        sessions,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load session history' });
    }
  }
}
