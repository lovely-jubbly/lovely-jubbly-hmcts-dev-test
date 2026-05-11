const request = require('supertest');
const { loadEnv } = require('../../src/config/env');
const { createApp } = require('../../src/app');

describe('GET /health', () => {
  const app = createApp(loadEnv());

  it('returns ok status', async () => {
    await request(app).get('/health').expect(200, { status: 'ok' });
  });
});
