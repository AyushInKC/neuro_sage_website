import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import { healthRouter } from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import campRoutes from './routes/camp.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';
import bodyDoublingRoutes from './routes/bodyDoubling.routes.js';
import liveBodyDoublingRoutes, { adminLiveBodyDoublingRouter } from './routes/liveBodyDoubling.routes.js';
import { Camp } from './models/Camp.js';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';

async function ensureBootstrapAdmin(): Promise<void> {
  const existing = await User.findOne({ $or: [{ username: config.admin.username }, { email: config.admin.email }] });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
    }
    if (!existing.username) {
      existing.username = config.admin.username;
      await existing.save();
    }
    return;
  }
  await User.create({
    name: 'NeuroSage Admin',
    username: config.admin.username,
    email: config.admin.email,
    passwordHash: await bcrypt.hash(config.admin.password, 12),
    role: 'admin',
    isEmailVerified: true,
  });
  console.log(`[Database] Bootstrap administrator created for ${config.admin.username}.`);
}

export const app = express();

// Security and utility middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health check (Ollama + MongoDB status — see routes/health.routes.ts)
app.use(healthRouter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/body-doubling', bodyDoublingRoutes);
app.use('/api/live-body-doubling', liveBodyDoublingRoutes);
app.use('/api/admin/live-body-doubling', adminLiveBodyDoublingRouter);

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled Application Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'An unexpected error occurred. Please try again.',
    });
  }
);

export async function connectDB(): Promise<void> {
  await mongoose.connect(config.mongoUri);
  try {
    console.log('[Database] Connected to MongoDB.');
    await ensureBootstrapAdmin();

    // Ensure Brainwell Camp event is seeded
    const existing = await Camp.findOne({ campCode: config.camp.code });
    if (!existing) {
      await Camp.create({
        campCode: config.camp.code,
        title: config.camp.title,
        tagline: config.camp.tagline,
        fee: config.camp.fee,
        capacity: config.camp.defaultCapacity,
        isOpen: true,
        waitlistEnabled: true,
        venue: 'Details to be announced',
        dates: 'Details to be announced',
        description:
          'Make space to pause, reconnect, and care for your mind. Brainwell Camp is a NeuroSage initiative designed to encourage mental-wellness awareness, mindful habits, and supportive conversations.',
      });
      console.log(`[Seed] Initialized ${config.camp.title} event configuration`);
    }
  } catch (err) {
    console.error('[Database] MongoDB initialization error:', err);
    throw err;
  }
}

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(config.port, () => {
      console.log(`[NeuroSage Server] Listening on http://localhost:${config.port}`);
    });
  }).catch((err) => {
    console.error('[NeuroSage Server] Startup aborted because MongoDB is unavailable.', err);
    process.exitCode = 1;
  });
}
