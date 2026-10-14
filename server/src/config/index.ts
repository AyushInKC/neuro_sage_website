import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neurosage',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'neurosage-super-secret-access-key-2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'neurosage-super-secret-refresh-key-2026',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieSameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  uploadDir: path.resolve(process.cwd(), 'uploads/slips'),
  hfToken: process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '',
  hfModel: process.env.HF_MODEL || 'meta-llama/Llama-3.2-3B-Instruct',
  camp: {
    code: 'BRAINWELL_2026',
    title: 'Brainwell Camp',
    tagline: 'Revive your mind.',
    fee: 49,
    defaultCapacity: 50,
  },
};
