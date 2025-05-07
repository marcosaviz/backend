const { UPDATE } = require('sequelize/lib/query-types');
const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');


const Employee = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM employees');
    return convertToCamelCase(rows);  // Aplica a conversão para camelCase
  },

  // Criar um novo funcionário
  create: async ({ name, birth_date, email, phone }) => {
    // Extrai apenas a parte da data no formato YYYY-MM-DD
    const formattedDate = new Date(birth_date).toISOString().split('T')[0];
    const snakeCaseData = {
      name,
      birth_date: formattedDate, // ✅ Corrigido para usar a data formatada
      email,
      phone
    };
    const [result] = await db.query(
      'INSERT INTO employees (name, birth_date, email, phone) VALUES (?, ?, ?, ?)',
      [name, formattedDate, email, phone]
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
    update: async (id, { name, birth_date, email, phone}) => {
      const formattedDate = new Date(birth_date).toISOString().split('T')[0];
      const snakeCaseData = {
        name,
        birth_date: formattedDate,
        email,
        phone
      };

      const [result] = await db.query(
        'UPDATE employees SET name = ?, birth_date = ?, email = ?, phone = ? WHERE id = ?',
        [name, formattedDate, email, phone, id]
      );
      return { id, ...snakeCaseData}; // Retorna os dados em cemelCase
    }
  };


module.exports = Employee;
