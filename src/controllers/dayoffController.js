const DayOff = require('../models/dayoffModel');
const Employee = require('../models/employeeModel'); // você precisa ter esse model
const { convertToCamelCase } = require('../utils/convertToCamelCase');
const Joi = require('joi');



// Definindo o esquema de validação para o DayOff
const dayOffSchema = Joi.object({
  employee_id: Joi.number().integer().required(),
  day: Joi.date().iso().required().messages({
    'data.base': 'O campo "day" deve ser uma data válida no formato ISO 8601'
  }),
  reason: Joi.string().max(255).required()
});

exports.getAll = async (req, res) => {
  try {
    const dayoffs = await DayOff.getAll();
    res.json(dayoffs);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor'});
  }
};

exports.create = async (req, res) => {
  console.log(req.body);  // Adicione isso para verificar os dados recebidos
  const { error } = dayOffSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { employee_id, day } = req.body;

  try {
    // 👇 Verifica se o funcionário existe
    const employee = await Employee.findById(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    // Verifica se já existe um "day off" para o mesmo funcionário na mesma data
    const existingDayOff = await DayOff.findByEmployeeAndDay(employee_id, day );
    if (existingDayOff) {
      return res.status(400).json({ error: 'O funcionário já possui um dayoff nesta data' });
    }

    // Criação do novo day off
    const newDayOff = await DayOff.create(req.body);
    res.status(201).json(newDayOff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await DayOff.delete(id);
    if (!result) {
      return res.status(400).json({error: 'Folga não encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir folga'});
  }
}
  
