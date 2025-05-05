const mysql = require('mysql2/promise');

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'maviz',
        password: 'J@P0nes1995'
    });

    try {
        console.log('Conectado ao MySQL!');

        await connection.query(`CREATE DATABASE IF NOT EXISTS escala12x36;`);
        console.log('Banco de dados escala12x36 verificado/criado.');

        await connection.query(`USE escala12x36;`);

        // Criação da tabela employees
        await connection.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                birth_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela employees criada/verificada.');

        // Drop + recriação das tabelas relacionadas com ON DELETE CASCADE
        await connection.query(`DROP TABLE IF EXISTS vacations;`);
        await connection.query(`
            CREATE TABLE vacations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                start_date DATE,
                end_date DATE,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela vacations criada com ON DELETE CASCADE.');

        await connection.query(`DROP TABLE IF EXISTS dayoffs;`);
        await connection.query(`
            CREATE TABLE dayoffs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                day DATE,
                reason VARCHAR(255),
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela dayoffs criada com ON DELETE CASCADE.');

        await connection.query(`DROP TABLE IF EXISTS shifts;`);
        await connection.query(`
            CREATE TABLE shifts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                shift_date DATE,
                shift_type ENUM('NIGHT', 'DAY'),
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela shifts criada com ON DELETE CASCADE.');

        // Tabela holidays (sem relação com employees)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS holidays (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE UNIQUE,
                description VARCHAR(255)
            );
        `);
        console.log('Tabela holidays criada/verificada.');

        console.log('Setup do banco concluído com sucesso!');
    } catch (error) {
        console.error('Erro ao criar o banco de dados:', error);
    } finally {
        await connection.end();
    }
}

setupDatabase();

/* 
Adicionar ON DELETE CASCADE nas Foreign Keys
Uma solução possível é garantir que, quando um registro em employees for excluído, os registros nas tabelas dependentes (vacations, dayoffs, shifts) sejam automaticamente removidos também. 
Você pode modificar a definição das chaves estrangeiras nas tabelas relacionadas para incluir a cláusula ON DELETE CASCADE, 
que irá excluir os registros dependentes automaticamente quando o funcionário for deletado.

Aqui está o código para modificar as tabelas para usar o ON DELETE CASCADE:

CREATE TABLE IF NOT EXISTS vacations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dayoffs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    day DATE,
    reason VARCHAR(255),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    shift_date DATE,
    shift_type ENUM('NIGHT', 'DAY'),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

*/