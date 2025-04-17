const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let employeeId;

beforeAll(async () => {
  const [rows] = await db.query('INSERT INTO employees (name, birth_date) VALUES (?, ?)', ['Fulano', '1995-05-20']);
  employeeId = rows.insertId || 1;
});

afterAll(async () => {
  await db.end();
});

describe('Vacation API', () => {

  it('Deve registrar férias', async () => {
    const response = await request(app)
      .post('/api/vacations')
      .send({
        employee_id: employeeId,
        start_date: '2025-05-01',
        end_date: '2025-05-15'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve listar todas as férias', async () => {
    const response = await request(app).get('/api/vacations');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
