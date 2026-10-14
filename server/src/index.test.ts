import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from './index.js';
import { config } from './config/index.js';
import { User } from './models/User.js';

describe('NeuroSage Backend API', () => {
  beforeAll(async () => {
    // Only connect if not connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }
  });

  afterAll(async () => {
    // Clean up test data if needed
    await User.deleteMany({ email: /test.*@neurosage\.test/ });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('NeuroSage API');
  });

  it('GET /api/camps/info should return Brainwell Camp details with fee 49', async () => {
    const res = await request(app).get('/api/camps/info');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.camp.fee).toBe(49);
    expect(res.body.camp.title).toBe('Brainwell Camp');
  });

  it('POST /api/auth/register should validate mismatched passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@neurosage.test',
      password: 'Password123!',
      confirmPassword: 'MismatchPassword!',
      agreeTerms: true,
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/camps/my-registrations should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/camps/my-registrations');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
