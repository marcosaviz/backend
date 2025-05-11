const Employee = require('../models/employeeModel');
const Joi = require('joi');

const employeeSchema = Joi.object({
  name: Joi.string().min(3).required(),
  birth_date: Joi.date().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).max(20).required()
});


// Obter todos os funcionários
exports.getAll = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json(employees);
  } catch (err) {
    console.error('Erro ao obter funcionário:', err);
    res.status(500).json({ error: 'Erro ao obter funcionários'});
  }
};

// Criar um novo funcionário
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

// Atualizar um funcionário
exports.update = async (req, res) => {
  try {
    // validação de dados recebidos
    const { error } = employeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error : error.details[0].message });
    }

    // Capituranjdo o ID do funcionário
    const { id } = req.params;

    // Atualizando o funcionário
    const updatedEmployee = await Employee.update(id, req.body);

    // Verificando se o funcionário foi encontrado e atualizado
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Funcionário não encontrado'});
    }
    res.status(200).json({ message: 'Funcionário atualizado com sucesso', data: updatedEmployee});
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    res.status(200).json({ error: 'Erro ao atualizar funcionário'});
  }
}


// Obter um funcionário por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID recebido no controller:', id); // Log para depuração
    const employee = await Employee.findById(id);

    if (!employee) {
      console.log('Funcionário não encontrado com o ID:', id);  // Log se não encontrar o funcionário
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
};

// Deletar um funcionário
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.delete(id);

    if (!deletedEmployee) {
      return res.status(404).json({message: 'Funcionário não encontrado'});
    }

    res.status(200).json({message: 'Funcionário deletado com sucesso', data: deletedEmployee});
  } catch (err) {
    console.error('Erro ao deletar funcionário:', err);
    res.status(500).json({ error: 'Erro ao deletar funcionário'});
  }
};
