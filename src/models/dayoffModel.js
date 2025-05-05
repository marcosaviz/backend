const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');




const DayOff = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM dayoffs');
    return convertToCamelCase(rows);
  },

  create: async ({ employee_id, day, reason }) => {
    const [result] = await db.query(
      'INSERT INTO dayoffs (employee_id, day, reason) VALUES (?, ?, ?)',
      [employee_id, day, reason]
    );
    return { id: result.insertId, employee_id, day, reason };
  }
};

module.exports = DayOff;
