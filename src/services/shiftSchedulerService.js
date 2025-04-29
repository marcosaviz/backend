const db = require('../config/database');

// Helper: Verifica se a data é final de semana
function isWeekend(date) {
  const day = date.getDay(); // 0 = Domingo, 6 = Sábado
  return day === 0 || day === 6;
}

// Helper: Verifica se é feriado
async function isHoliday(date) {
  const [rows] = await db.query(
    'SELECT * FROM holidays WHERE date = ?',
    [date.toISOString().split('T')[0]]
  );
  return rows.length > 0;
}

// Verifica se funcionário está de day off ou férias
async function isUnavailable(employee_id, date) {
  const sql = `
    SELECT 'vacation' FROM vacations 
      WHERE employee_id = ? AND ? BETWEEN start_date AND end_date
    UNION
    SELECT 'dayoff' FROM dayoffs
      WHERE employee_id = ? AND day = ?
  `;
  const [rows] = await db.query(sql, [
    employee_id, date, employee_id, date.toISOString().split('T')[0]
  ]);
  return rows.length > 0;
}

// Geração de escala
async function generateShifts(startDate, endDate) {
  const [employees] = await db.query('SELECT id FROM employees');
  let shiftPlan = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {

    const isHolidayFlag = await isHoliday(day);
    const isWeekendFlag = isWeekend(day);

    const shiftType = (isHolidayFlag || isWeekendFlag) ? 'DAY' : 'NIGHT';

    for (const employee of employees) {

      const unavailable = await isUnavailable(employee.id, day);
      if (unavailable) continue;

      // Alternância 12x36: verificar se trabalhou 2 dias antes
      const [lastShift] = await db.query(`
        SELECT shift_date FROM shifts
        WHERE employee_id = ? ORDER BY shift_date DESC LIMIT 1
      `, [employee.id]);

      if (lastShift.length > 0) {
        const lastDate = new Date(lastShift[0].shift_date);
        const diffDays = (day - lastDate) / (1000 * 3600 * 24);
        if (diffDays < 2) continue; // Respeitar 12x36
      }

      // Se passou nos filtros: agendar!
      await db.query(`
        INSERT INTO shifts (employee_id, shift_date, shift_type) VALUES (?, ?, ?)
      `, [employee.id, day.toISOString().split('T')[0], shiftType]);

      shiftPlan.push({
        employee_id: employee.id,
        date: new Date(day),
        shiftType
      });

      break; // Só um funcionário por dia, se for escala simples.
    }
  }

  return shiftPlan;
}

module.exports = {
  generateShifts
};
