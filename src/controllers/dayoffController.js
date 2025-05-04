const DayOff = require('../models/dayoffModel');
const Employee = require('../models/employeeModel'); // você precisa ter esse model
const Joi = require('joi');

const dayOffSchema = Joi.object({
  employee_id: Joi.number().integer().required(),
  day: Joi.date().required(),
  reason: Joi.string().max(255).required()
});

exports.getAll = async (req, res) => {
  const dayoffs = await DayOff.getAll();
  res.json(dayoffs);
};

exports.create = async (req, res) => {
  const { error } = dayOffSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { employee_id } = req.body;

  try {
    // 👇 Verifica se o funcionário existe
    const employee = await Employee.findById(employee_id); // ou findByPk, dependendo do ORM
    if (!employee) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    const newDayOff = await DayOff.create(req.body);
    res.status(201).json(newDayOff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
