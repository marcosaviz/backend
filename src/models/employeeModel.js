const { UPDATE } = require('sequelize/lib/query-types');
const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');


const Employee = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM employees');
    return convertToCamelCase(rows);  // Aplica a conversão para camelCase
  },

  // Criar um novo funcionário
  create: async ({ name, birth_date }) => {
    const snakeCaseData = {
      name: name,
      birth_date: birth_date
    };
    const [result] = await db.query(
      'INSERT INTO employees (name, birth_date) VALUES (?, ?)',
      [snakeCaseData.name, snakeCaseData.birth_date]
    );
    return { id: result.insertId, ...snakeCaseData }; // Retornar os dados em camelCase
  },


   // Deletar um funcionário
  delete: async (id) => {
    await db.query('DELETE FROM employees WHERE id = ?', [id]);
    return true;
  },

    /// Buscar funcionário por ID com conversão para camelCase
    findById: async (id) => {
      const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
      return rows.length ? convertToCamelCase(rows)[0] : null;  // Aplica a conversão para camelCase
    },


    // Atualiza um funcionário
    update: async (id, { name, birth_date}) => {
      const snakeCaseData = {
        name,
        birth_date
      };

      const [result] = await db.query(
        'UPDATE employees SET name = ?, birth_date = ? WHERE id = ?',
        [snakeCaseData.name, snakeCaseData.birth_date, id]
      );
      return { id, ...snakeCaseData}; // Retorna os dados em cemelCase
    }
  };


module.exports = Employee;
