const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

beforeAll(async () => {
  //Limpeza em ordem correta para evitar erros de chave estrangeira
  // await db.query('DELETE FROM dayoffs');
  // await db.query('DELETE FROM vacations');
  // await db.query('DELETE FROM shifts');
  // await db.query('DELETE FROM employees');
});

afterAll(async () => {
  // Limpeza extra opcional, se necessário
  // await db.query('DELETE FROM employees');
  await db.end();

  // Workaround para Jest garantir o encerramento de handles
  await new Promise(resolve => setTimeout(resolve, 100));
});

it('Deve retornar erro ao criar funcionário sem nome', async () => {
  const response = await request(app)
    .post('/api/employees')
    .send({ birth_date: '1980-01-01' });

  expect([400, 422]).toContain(response.statusCode); // flexível conforme sua validação
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
