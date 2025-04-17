const DayOff = require('../models/dayoffModel');
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

  const newDayOff = await DayOff.create(req.body);
  res.status(201).json(newDayOff);
};
