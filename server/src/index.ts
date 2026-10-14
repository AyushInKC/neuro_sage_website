import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import authRoutes from './routes/auth.routes.js';
import campRoutes from './routes/camp.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';
import bodyDoublingRoutes from './routes/bodyDoubling.routes.js';
import { Camp } from './models/Camp.js';

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

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NeuroSage API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/body-doubling', bodyDoublingRoutes);

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
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`[Database] Connected to MongoDB at ${config.mongoUri}`);

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
  } catch (err: any) {
    console.error('[Database] MongoDB connection error:', err.message);
  }
}

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(config.port, () => {
      console.log(`[NeuroSage Server] Listening on http://localhost:${config.port}`);
    });
  });
}
