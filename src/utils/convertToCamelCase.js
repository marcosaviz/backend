// Função para converter de snake_case para camelCase
const snakeToCamel = (str) => {
    return str.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
  };
  
  // Função para converter todos os objetos de snake_case para camelCase
  const convertToCamelCase = (rows) => {
    return rows.map(row => {
      const newRow = {};
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          newRow[snakeToCamel(key)] = row[key];  // Converte cada chave
        }
      }
      return newRow;
    });
  };
  
module.exports = { convertToCamelCase };