import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { User } from '../models/User.js';
import {
  generateTokens,
  setAuthCookies,
  clearAuthCookies,
  AuthenticatedUserPayload,
} from '../middleware/auth.middleware.js';
import { EmailService } from '../services/email.service.js';
import mongoose from 'mongoose';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy',
  }),
  consentNonEssential: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
const adminLoginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1),
});

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        res.status(503).json({ success: false, message: 'Unable to connect to the service. Please try again.' });
        return;
      }
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.errors[0]?.message || 'Invalid input data',
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const { name, email, password, consentNonEssential } = parsed.data;
      const normalizedEmail = email.toLowerCase().trim();

      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        // Enforce uniqueness without leaking account details
        res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.',
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const user = new User({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        isEmailVerified: true,
        verificationToken,
        consentNonEssential: !!consentNonEssential,
      });

      const payload: AuthenticatedUserPayload = {
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      };

      const tokens = generateTokens(payload);
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await user.save();
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      // Async email trigger
      EmailService.sendVerificationEmail(user.email, verificationToken).catch((err) =>
        console.error('Verification email error:', err)
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully. Welcome to NeuroSage.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (err: any) {
      if (err?.code === 11000) {
        res.status(409).json({ success: false, message: 'An account with this email address already exists. Please log in.' });
        return;
      }
      console.error('Registration error:', err?.message || err);
      res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        res.status(503).json({ success: false, message: 'Unable to connect to the service. Please try again.' });
        return;
      }

      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email and password.',
        });
        return;
      }

      const { email, password } = parsed.data;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ email: normalizedEmail });
      // Non-revealing error message to prevent account enumeration
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const payload: AuthenticatedUserPayload = {
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      };

      const tokens = generateTokens(payload);
      // Clean up expired tokens and add new one
      user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > new Date());
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await user.save();

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      res.status(200).json({
        success: true,
        message: 'Welcome back.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  }

  public static async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const parsed = adminLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Username and password are required.' });
        return;
      }
      const user = await User.findOne({
        $or: [{ username: parsed.data.username }, { email: parsed.data.username.toLowerCase() }],
        role: 'admin',
      });
      if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
        res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
        return;
      }
      const payload: AuthenticatedUserPayload = {
        id: (user._id as any).toString(), email: user.email, role: user.role, name: user.name,
      };
      const tokens = generateTokens(payload);
      user.refreshTokens = user.refreshTokens.filter((token) => token.expiresAt > new Date());
      user.refreshTokens.push({ token: tokens.refreshToken, createdAt: new Date(), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
      await user.save();
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified } });
    } catch (err) {
      console.error('Admin login error:', err);
      res.status(500).json({ success: false, message: 'Administrator sign in is unavailable.' });
    }
  }

  public static async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const user = await User.findById(req.user.id).select('-passwordHash -refreshTokens');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken && req.user) {
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { refreshTokens: { token: refreshToken } },
        });
      }

      clearAuthCookies(res);
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (err) {
      clearAuthCookies(res);
      res.status(200).json({ success: true, message: 'Logged out.' });
    }
  }

  public static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, message: 'Email is required' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        EmailService.sendPasswordResetEmail(user.email, resetToken).catch((err) =>
          console.error('Password reset email error:', err)
        );
      }

      // Consistent message to prevent email enumeration
      res.status(200).json({
        success: true,
        message:
          'If an account exists with that email address, password reset instructions have been sent.',
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  public static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword || newPassword.length < 8) {
        res.status(400).json({
          success: false,
          message: 'Valid token and new password of at least 8 characters are required.',
        });
        return;
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Password reset link is invalid or has expired.',
        });
        return;
      }

      user.passwordHash = await bcrypt.hash(newPassword, 12);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.refreshTokens = []; // Revoke previous sessions
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. You may now log in.',
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}
