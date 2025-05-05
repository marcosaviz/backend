const shiftService = require('../services/shiftSchedulerService');
const db = require('../config/database');

exports.generate = async (req, res) => {
  const { start_date, end_date } = req.body;
  if (!start_date || !end_date) return res.status(400).json({ error: 'Informe start_date e end_date' });

  const shifts = await shiftService.generateShifts(new Date(start_date), new Date(end_date));
  res.status(201).json({ generated: shifts.length, shifts });
};

exports.list = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, e.name AS employeeName
      FROM shifts s
      JOIN employees e ON e.id = s.employee_id
      ORDER BY s.shift_date
      `);


      res.json(rows);
  }   catch (error) {
    console.error( 'Erro ao buscar escalas:' ,error);
    res.status(500).json({ message: 'Erro ao buscar escalas.'});
  }
  
};
