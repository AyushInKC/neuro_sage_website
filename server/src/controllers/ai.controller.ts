import { Request, Response } from 'express';
import crypto from 'crypto';
import { ChatConversation, IChatMessage } from '../models/ChatConversation.js';
import { AIService } from '../services/ai.service.js';

export class AIController {
  /**
   * Processes a message from the authenticated user and returns an empathetic response.
   */
  public static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { message } = req.body;
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ success: false, message: 'Please enter a message' });
        return;
      }

      const trimmedMessage = message.trim();

      // Find or create conversation for user
      let conversation = await ChatConversation.findOne({ user: req.user.id });
      if (!conversation) {
        conversation = new ChatConversation({
          user: req.user.id,
          title: 'Reflective Space',
          messages: [],
        });
      }

      const userMsg: IChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmedMessage,
        timestamp: new Date(),
      };

      conversation.messages.push(userMsg);

      // Call AI Service
      const aiResponse = await AIService.generateResponse(
        conversation.messages.map((m) => ({ role: m.role, content: m.content })),
        trimmedMessage
      );

      const assistantMsg: IChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse.reply,
        timestamp: new Date(),
      };

      conversation.messages.push(assistantMsg);
      await conversation.save();

      res.status(200).json({
        success: true,
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        crisisHelplineTriggered: aiResponse.crisisHelplineTriggered,
        suggestedGrounding: aiResponse.suggestedGrounding,
      });
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      res.status(500).json({
        success: false,
        message: 'The companion is momentarily resting. Please take a mindful breath and try again.',
      });
    }
  }

  /**
   * Retrieves user's conversation history.
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const conversation = await ChatConversation.findOne({ user: req.user.id });
      res.status(200).json({
        success: true,
        messages: conversation?.messages || [],
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load conversation history' });
    }
  }

  /**
   * Clears the user's conversation history.
   */
  public static async clearHistory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      await ChatConversation.findOneAndDelete({ user: req.user.id });
      res.status(200).json({
        success: true,
        message: 'Reflective space has been gently cleared.',
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to clear conversation' });
    }
  }
}
