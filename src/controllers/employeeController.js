const Employee = require('../models/employeeModel');
const Joi = require('joi');

const employeeSchema = Joi.object({
  name: Joi.string().min(3).required(),
  birth_date: Joi.date().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).max(20).required()
});

exports.getAll = async (req, res) => {
  const employees = await Employee.getAll();
  res.json(employees);
};

exports.create = async (req, res) => {
  console.log('Body recebido no backend', req.body); // Verificação

  const { error } = employeeSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Erro ao criar funcionário:', err);
    res.status(400).json({ error: 'Erro ao criar funcionário'});
    }
  };
exports.delete = async (req, res) => {
  await Employee.delete(req.params.id);
  res.status(204).send();
};
