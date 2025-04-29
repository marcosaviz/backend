const Employee = require('../models/employeeModel');
const Joi = require('joi');

const employeeSchema = Joi.object({
  name: Joi.string().min(3).required(),
  birth_date: Joi.date().required()
});

exports.getAll = async (req, res) => {
  const employees = await Employee.getAll();
  res.json(employees);
};

exports.create = async (req, res) => {
  const { error } = employeeSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const newEmployee = await Employee.create(req.body);
  res.status(201).json(newEmployee);
};

exports.delete = async (req, res) => {
  await Employee.delete(req.params.id);
  res.status(204).send();
};
