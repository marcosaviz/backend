const db = require('../config/database');

const Vacation = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM vacations');
    return rows;
  },

  getByEmployee: async (employee_id) => {
    const [rows] = await db.query('SELECT * FROM vacations WHERE employee_id = ?', [employee_id]);
    return rows;
  },

  create: async ({ employee_id, start_date, end_date }) => {
    const [result] = await db.query(
      'INSERT INTO vacations (employee_id, start_date, end_date) VALUES (?, ?, ?)',
      [employee_id, start_date, end_date]
    );
    return { id: result.insertId, employee_id, start_date, end_date };
  }
};

module.exports = Vacation;
