const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let employeeId;

beforeAll(async () => {
  const [rows] = await db.query('INSERT INTO employees (name, birth_date) VALUES (?, ?)', ['Ciclano', '1980-07-11']);
  employeeId = rows.insertId || 1;
});

afterAll(async () => {
  await db.end();
});

describe('Dayoff API', () => {

  it('Deve criar dayoff de aniversário', async () => {
    const response = await request(app)
      .post('/api/dayoffs')
      .send({
        employee_id: employeeId,
        day: '2025-07-11',
        reason: 'Aniversário'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve listar todos os dayoffs', async () => {
    const response = await request(app).get('/api/dayoffs');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

