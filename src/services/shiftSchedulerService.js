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


// Geração de escala
async function generateShifts(startDate, endDate) {
  const [employees] = await db.query('SELECT id FROM employees');
  let shiftPlan = [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = new Date(d); // evita mutação de data
    
    const isHolidayFlag = await isHoliday(day);
    const isWeekendFlag = isWeekend(day);
    
    // Determine quais turnos devem ser gerados
    const shiftsToGenerate = [];

    if (isHolidayFlag || isWeekendFlag) {
      shiftsToGenerate.push({ type: 'DAY', max: 1 });
      shiftsToGenerate.push({ type: 'NIGHT', max: 1 });
    } else {
      shiftsToGenerate.push({ type: 'NIGHT', max: 2 });
    }

    for (const shift of shiftsToGenerate) {
      const [existingShifts] = await db.query(`
        SELECT * FROM shifts WHERE shift_date = ? AND shift_type = ?
      `, [day.toISOString().split('T')[0], shift.type]);

      if (existingShifts.length >= shift.max) continue;

      let assigned = existingShifts.length;

      for (const employee of employees) {
        if (assigned >= shift.max) break;

        const unavailable = await isUnavailable(employee.id, day);
        if (unavailable) continue;

        const [lastShift] = await db.query(`
          SELECT shift_date FROM shifts
          WHERE employee_id = ? ORDER BY shift_date DESC LIMIT 1
        `, [employee.id]);

        if (lastShift.length > 0) {
          const lastDate = new Date(lastShift[0].shift_date);
          const diffDays = (day - lastDate) / (1000 * 3600 * 24);
          if (diffDays < 2) continue;
        }

        await db.query(`
          INSERT INTO shifts (employee_id, shift_date, shift_type) VALUES (?, ?, ?)
        `, [employee.id, day.toISOString().split('T')[0], shift.type]);

        shiftPlan.push({
          employee_id: employee.id,
          date: new Date(day),
          shiftType: shift.type
        });

        assigned++;
      }
    }
  }

  return shiftPlan;
}



// Deleta a escala gerada
async function deleteShifts() {
  await db.query('DELETE FROM shifts');
  return { message: 'Escala apagada com sucesso!' };
}

module.exports = {
  generateShifts,
  deleteShifts
};