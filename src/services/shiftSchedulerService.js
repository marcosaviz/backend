// Serviço de Geração de Escala 12x36
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

// Deleta a escala gerada
async function deleteShifts() {
  await db.query('DELETE FROM shifts');
  return { message: 'Escala apagada com sucesso!' };
}

// Geração de escala
async function generateShifts(startDate, endDate) {
  const [employees] = await db.query('SELECT id FROM employees');
  let shiftPlan = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = new Date(d); // Cópia da data para evitar mutações

    const isHolidayFlag = await isHoliday(day);
    const isWeekendFlag = isWeekend(day);

    const shiftType = (isHolidayFlag || isWeekendFlag) ? 'DAY' : 'NIGHT';
    let assignedNight = 0;

    // Verificar se já existe escala para o dia/turno
    const [existingShifts] = await db.query(`
      SELECT * FROM shifts WHERE shift_date = ? AND shift_type = ?
    `, [day.toISOString().split('T')[0], shiftType]);

    if ((shiftType === 'DAY' && existingShifts.length >= 1) ||
        (shiftType === 'NIGHT' && existingShifts.length >= 2)) {
      continue;
    }

    for (const employee of employees) {
      const unavailable = await isUnavailable(employee.id, day);
      if (unavailable) continue;

      // Alternância 12x36
      const [lastShift] = await db.query(`
        SELECT shift_date FROM shifts
        WHERE employee_id = ? ORDER BY shift_date DESC LIMIT 1
      `, [employee.id]);

      if (lastShift.length > 0) {
        const lastDate = new Date(lastShift[0].shift_date);
        const diffDays = (day - lastDate) / (1000 * 3600 * 24);
        if (diffDays < 2) continue;
      }

      // Agendar turno
      await db.query(`
        INSERT INTO shifts (employee_id, shift_date, shift_type) VALUES (?, ?, ?)
      `, [employee.id, day.toISOString().split('T')[0], shiftType]);

      shiftPlan.push({
        employee_id: employee.id,
        date: new Date(day),
        shiftType
      });

      if (shiftType === 'NIGHT') assignedNight++;
      break; // Apenas um funcionário por turno do dia, máximo dois à noite
    }
  }

  return shiftPlan;
}

module.exports = {
  generateShifts,
  deleteShifts
};
