const shiftService = require('../services/shiftSchedulerService');
const db = require('../config/database');

exports.generate = async (req, res) => {
  const { start_date, end_date } = req.body;
  if (!start_date || !end_date) return res.status(400).json({ error: 'Informe start_date e end_date' });

  const shifts = await shiftService.generateShifts(new Date(start_date), new Date(end_date));
  res.status(201).json({ generated: shifts.length, shifts });
};

exports.list = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM shifts ORDER BY shift_date');
  res.json(rows);
};
