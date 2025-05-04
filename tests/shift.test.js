const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let employeeId;

beforeAll(async () => {
  // await db.query('DELETE FROM vacations');
  // await db.query('DELETE FROM dayoffs');
  // await db.query('DELETE FROM shifts');
  // await db.query('DELETE FROM employees');

  const [result] = await db.query(
    'INSERT INTO employees (name, birth_date) VALUES (?, ?)',
    ['Gerador de Turno', '1990-01-01']
  );
  employeeId = result.insertId;
});

afterAll(async () => {
  // await db.query('DELETE FROM shifts');
  // await db.query('DELETE FROM employees');
  await db.end();

  // Pequeno delay para garantir fechamento de handles em Jest
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Shift Scheduler API', () => {
  it('Deve gerar escala de trabalho válida', async () => {
    const response = await request(app)
      .post('/api/shifts/generate')
      .send({ start_date: '2025-06-01', end_date: '2025-06-07' });

    // console.log('Resposta:', response.body); // Descomente só se precisar debugar

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
