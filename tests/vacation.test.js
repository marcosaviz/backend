const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let employeeId;

beforeAll(async () => {
  // Limpar tabelas para evitar conflitos de FK
  await db.query('DELETE FROM vacations');
  // await db.query('DELETE FROM employees');

  // Criar funcionário de teste
  const [result] = await db.query(
    'INSERT INTO employees (name, birth_date) VALUES (?, ?)',
    ['Fulano', '1995-05-20']
  );
  employeeId = result.insertId;
});

afterAll(async () => {
  // Limpar dados criados e encerrar conexão
  // await db.query('DELETE FROM vacations');
  // await db.query('DELETE FROM employees');
  await db.end();

  // Pequeno delay para evitar open handles
  await new Promise((resolve) => setTimeout(resolve, 100));
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
