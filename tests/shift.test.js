const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

beforeAll(async () => {
  await db.query('DELETE FROM shifts');
});

afterAll(async () => {
  await db.end();
});

describe('Shift Scheduler API', () => {

  it('Deve gerar escala de trabalho válida', async () => {
    const response = await request(app)
      .post('/api/shifts/generate')
      .send({ start_date: '2025-06-01', end_date: '2025-06-07' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('generated');
    expect(response.body.generated).toBeGreaterThanOrEqual(1);
  });

  it('Deve listar escalas criadas', async () => {
    const response = await request(app).get('/api/shifts');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
