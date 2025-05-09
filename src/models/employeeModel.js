
const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');



// Função auxiliar para formatar datas
const formatData = (date) => new Date(date).toISOString().split('T')[0];


const Employee = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM employees');
    return convertToCamelCase(rows);  // Aplica a conversão para camelCase
  },

  // Criar um novo funcionário
  create: async ({ name, birth_date, email, phone }) => {
    // Extrai apenas a parte da data no formato YYYY-MM-DD
    const formattedDate = formatData(birth_date);
    const snakeCaseData = {
      name,
      birth_date: formattedDate,
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
    const [employee] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    if (employee.length === 0) {
      return null; // Retorna null se não encontrar o funcionário
    }

    await db.query('DELETE FROM employees WHERE id = ?', [id]);
    return convertToCamelCase(employee)[0]; // Retorna os dados do funcionário deletado
  },

    /// Buscar funcionário por ID com conversão para camelCase
    findById: async (id) => {
      const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
      return rows.length ? convertToCamelCase(rows)[0] : null;  // Aplica a conversão para camelCase
    },


    // Atualiza um funcionário
    update: async (id, { name, birth_date, email, phone}) => {
      const formattedDate = formatData(birth_date);
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
