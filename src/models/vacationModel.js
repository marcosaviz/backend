const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');



const Vacation = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM vacations');
    return convertToCamelCase(rows); // Aplica a conversão para camelCase
  },


  // Obter férias de um funcionário específico
  getByEmployee: async (employee_id) => {
    const [rows] = await db.query('SELECT * FROM vacations WHERE employee_id = ?', [employee_id]);
    return convertToCamelCase(rows);  // Aplica a conversão para camelCase
  },


  // Criar um novo registro de férias
  create: async ({ employee_id, start_date, end_date }) => {
    // Converter os dados para snake_case antes de inserir no banco de dados
    const snakeCaseData = {
      employee_id,
      start_date,
      end_date
    };
    const [result] = await db.query(
      'INSERT INTO vacations (employee_id, start_date, end_date) VALUES (?, ?, ?)',
      [snakeCaseData.employee_id, snakeCaseData.start_date, snakeCaseData.end_date]
    );
    return { id: result.insertId, ... snakeCaseData };
  }
};

module.exports = Vacation;
