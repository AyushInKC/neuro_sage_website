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

  it('POST /api/auth/register persists a hashed user and login works', async () => {
      const email = `test-${Date.now()}@neurosage.test`;
      const register = await request(app).post('/api/auth/register').send({
        name: 'Persisted Test User',
        email,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: true,
      });
      expect(register.status).toBe(201);
      const stored = await User.findOne({ email });
      expect(stored).not.toBeNull();
      expect(stored?.passwordHash).not.toBe('Password123!');
      expect(stored?.passwordHash).toMatch(/^\$2[aby]\$/);

      const login = await request(app).post('/api/auth/login').send({
        email,
        password: 'Password123!',
      });
      expect(login.status).toBe(200);
      expect(login.body.user.email).toBe(email);
    });

  it('rejects duplicate and invalid registrations', async () => {
      const email = `test-duplicate-${Date.now()}@neurosage.test`;
      const body = {
        name: 'Duplicate Test User',
        email,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: true,
      };
      expect((await request(app).post('/api/auth/register').send(body)).status).toBe(201);
      expect((await request(app).post('/api/auth/register').send(body)).status).toBe(400);
      expect((await request(app).post('/api/auth/register').send({ ...body, email: 'not-an-email' })).status).toBe(400);
      expect((await request(app).post('/api/auth/register').send({ ...body, email: `test-short-${Date.now()}@neurosage.test`, password: 'short', confirmPassword: 'short' })).status).toBe(400);
  });

  it('GET /api/camps/my-registrations should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/camps/my-registrations');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
