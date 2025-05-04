const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');


const Employee = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM employees');
    return convertToCamelCase(rows);  // Aplica a conversão para camelCase
  },

  // Criar um novo funcionário
  create: async ({ name, birth_date }) => {
    const [result] = await db.query(
      'INSERT INTO employees (name, birth_date) VALUES (?, ?)',
      [name, birth_date]
    );
    return { id: result.insertId, name, birth_date };
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
    }
  };


module.exports = Employee;
