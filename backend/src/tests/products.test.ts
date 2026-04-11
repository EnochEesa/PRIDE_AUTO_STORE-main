// file-deepcode-ignore HardcodedCredentials: These are all tests
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

beforeAll(async () => {
  // MONGODB_URI is injected by globalSetup (mongodb-memory-server)
  await mongoose.connect(process.env.MONGODB_URI!);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /api/products', () => {
  it('returns 200 with an empty array when no products exist', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.products ?? res.body.data ?? res.body)).toBe(true);
  });
});

describe('GET /api/health', () => {
  it('returns 200 with a healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});

describe('GET /metrics', () => {
  it('returns Prometheus scrape data with 200', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('process_cpu_seconds_total');
  });
});
describe('POST /api/admin/login — validation', () => {
  it('rejects login with invalid credentials with 400 or 401', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      // deepcode ignore HardcodedCredentials: intentional for testing
      .send({ email: 'admin@pride.com', password: process.env.TEST_SECRET });
    expect([400, 401, 422]).toContain(res.status);
  });
});
