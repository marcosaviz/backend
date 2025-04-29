const mysql = require('mysql2/promise');

// Configuração do banco
const connection = mysql.createPool({
    host: 'localhost',       // ou o IP do seu banco
    user: 'root',
    password: 'root',
    database: 'escala12x36',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;