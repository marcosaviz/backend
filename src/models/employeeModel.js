const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');



// Função auxiliar para formatar datas
const formatData = (date) => new Date(date).toISOString().split('T')[0];


const Employee = {
  // Lista todos os funcionários
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM employees');
    return convertToCamelCase(rows);  // Aplica a conversão para camelCase
  },

  // Criar um novo funcionário
  create: async ({ name, birth_date, email, phone }) => {
    // Extrai apenas a parte da data no formato YYYY-MM-DD
    const formattedDate = formatData(birth_date);
    const snakeCaseData = {
      name,
      birth_date: formattedDate,
      email,
      phone
    };

    const [result] = await db.query(
      'INSERT INTO employees (name, birth_date, email, phone) VALUES (?, ?, ?, ?)',
      [name, formattedDate, email, phone]
    );
    return { id: result.insertId, ...snakeCaseData }; // Retornar os dados em camelCase
  },


  // Deletar um funcionário
  delete: async (id) => {
    const [employee] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    if (employee.length === 0) {
      return null; // Retorna null se não encontrar o funcionário
    }

    await db.query('DELETE FROM employees WHERE id = ?', [id]);
    return convertToCamelCase(employee)[0]; // Retorna os dados do funcionário deletado
  },

    /// Buscar funcionário por ID com conversão para camelCase
  findById: async (id) => {
  const parsedId = parseInt(id, 10); // Certifique-se de que o id é numérico
  console.log('ID do funcionário no banco de dados:', parsedId); // Log para depuração
  const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [parsedId]);

  if (rows.length === 0) {
    console.log('Nenhum funcionário encontrado com o ID:', parsedId);  // Log caso não encontre
  } else {
    console.log('Funcionário encontrado:', rows[0]);  // Log para verificação
  }

  return rows.length ? convertToCamelCase(rows)[0] : null;
},


    // Atualiza um funcionário
    update: async (id, { name, birth_date, email, phone}) => {
      try {
        const formattedDate = formatData(birth_date);
        const snakeCaseData = {
          name,
          birth_date: formattedDate,
          email,
          phone
        };
        // Executa a atualização no banco de dados
        const [result] = await db.query(
          'UPDATE employees SET name = ?, birth_date = ?, email = ?, phone = ? WHERE id = ?',
          [name, formattedDate, email, phone, id]
        );

         // Verifica se algum registro foi afetado
         if (result.affectedRows === 0 ) {
          return null; // Não encontrou o funcionário para atualizar
         }

          // Retorna os dados atualizados em camelCase
          return { id, ...snakeCaseData};
      } catch (error) {
        console.error('Erro ao atualizar funcionário', error);
        throw error;
      }

    }

  };


module.exports = Employee;
