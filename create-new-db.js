const mysql = require('mysql2/promise');

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',  //  ou localhost
        user: 'marcos',
        password: 'marcos20'
    });

    try {
        console.log('Conectado ao MySQL!');

        await connection.query(`CREATE DATABASE IF NOT EXISTS escala12x36;`);
        console.log('Banco de dados escala12x36 verificado/criado.');

        await connection.query(`USE escala12x36;`);

        // Criação da tabela employees com email e phone
        await connection.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                birth_date DATE NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela employees criada/verificada com email e phone.');

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
