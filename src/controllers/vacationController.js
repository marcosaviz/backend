const Vacation = require('../models/vacationModel');
const Joi = require('joi');

const vacationSchema = Joi.object({
  employee_id: Joi.number().integer().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required()
});

exports.getAll = async (req, res) => {
  const vacations = await Vacation.getAll();
  res.json(vacations);
};

exports.create = async (req, res) => {
  const { error } = vacationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newVacation = await Vacation.create(req.body);
  res.status(201).json(newVacation);
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Vacation.delete(id);
    if (!result) {
      return res.status(400).json({error: 'Férias não encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao Excluir Férias' });
  }
}
