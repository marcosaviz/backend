const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

beforeAll(async () => {
  await db.query('DELETE FROM employees');
});

afterAll(async () => {
  await db.end();
});

describe('Employee API', () => {

  it('Deve criar um funcionário novo', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send({ name: 'Maria Teste', birth_date: '1990-10-10' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Maria Teste');
  });

  it('Deve listar funcionários', async () => {
    const response = await request(app).get('/api/employees');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
