const db = require('../config/database');

const Employee = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM employees');
    return rows;
  },
  create: async ({ name, birth_date }) => {
    const [result] = await db.query('INSERT INTO employees (name, birth_date) VALUES (?, ?)', [name, birth_date]);
    return { id: result.insertId, name, birth_date };
  },
  delete: async (id) => {
    await db.query('DELETE FROM employees WHERE id = ?', [id]);
    return true;
  }
};

module.exports = Employee;
