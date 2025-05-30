const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');



// Função auxiliar para formatar datas
const formatData = (date) => new Date(date).toISOString().split('T')[0];


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
  },

  delete: async (id) => {
    const [vacation] = await db.query('SELECT * FROM vacations WHERE id = ?', [id]);
    if (!vacation || vacation.length === 0) {
      return null;
    }

    await db.query('DELETE FROM vacations WHERE id = ?', [id]);
    return convertToCamelCase(vacation)[0]; // Retorna os dados do funcionário deletado
  }
};

module.exports = Vacation;
