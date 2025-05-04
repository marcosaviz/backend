const mysql = require('mysql2/promise');

// Configuração do banco
const connection = mysql.createPool({
    host: '172.22.112.1',   // ou o IP do seu banco
    user: 'marcos',
    password: 'marcos20',
    database: 'escala12x36',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Função de teste de conexão
async function testConnection() {
    try {
        // Tentando uma consulta simples para verificar a conexão
        const [rows, fields] = await connection.execute('SELECT 1');
        console.log('Teste realizado com sucesso');
        console.log('Resultado da consulta:', rows);
    } catch (error) {
        console.error('Erro ao conectar no banco de dados:', error);
    }
}

testConnection();