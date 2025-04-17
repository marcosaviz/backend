const mysql = require('mysql2/promise');

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root'
    });

    try {
        console.log('Conectado ao MySQL!');

        await connection.query(`CREATE DATABASE IF NOT EXISTS escala12x36;`);
        console.log('Banco de dados escala12x36 verificado/criado.');

        await connection.query(`USE escala12x36;`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                birth_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela employees criada/verificada.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS vacations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                start_date DATE,
                end_date DATE,
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );
        `);
        console.log('Tabela vacations criada/verificada.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS dayoffs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                day DATE,
                reason VARCHAR(255),
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );
        `);
        console.log('Tabela dayoffs criada/verificada.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS shifts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                shift_date DATE,
                shift_type ENUM('NIGHT', 'DAY'),
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );
        `);
        console.log('Tabela shifts criada/verificada.');

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