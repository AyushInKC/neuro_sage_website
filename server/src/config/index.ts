import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://localhost:27017/neurosage',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || crypto.randomBytes(32).toString('hex'),
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || crypto.randomBytes(32).toString('hex'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieSameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  admin: {
    username: process.env.ADMIN_USERNAME || 'NeuroSage123',
    password: process.env.ADMIN_PASSWORD || 'NeuroSage@3344',
    email: process.env.ADMIN_EMAIL || 'admin@neurosage.org',
  },
  liveBodyDoubling: {
    amount: 299,
    currency: 'INR',
    qrImageUrl: process.env.UPI_QR_IMAGE_URL || '',
    upiId: process.env.UPI_ID || '',
    jitsiDomain: process.env.JITSI_DOMAIN || 'meet.jit.si',
  },
  uploadDir: path.resolve(process.cwd(), 'uploads/slips'),
  // AI provider configuration
  aiProvider: process.env.AI_PROVIDER || 'ollama',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
  // Legacy Hugging Face configuration (no longer used)
  // hfToken: process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '',
  // hfModel: process.env.HF_MODEL || 'meta-llama/Llama-3.2-3B-Instruct',
  camp: {
    code: 'BRAINWELL_2026',
    title: 'Brainwell Camp',
    tagline: 'Revive your mind.',
    fee: 49,
    defaultCapacity: 50,
  },
};
