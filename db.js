const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const createTables = () => {
  // Create users table
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      phone_number VARCHAR(20),
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      weight FLOAT,
      height FLOAT,
      email VARCHAR(100),
      password VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Create chat_ids table
  pool.query(`
    CREATE TABLE IF NOT EXISTS chat_ids (
      chat_id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255),
      subject VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Create chat_data table
  pool.query(`
    CREATE TABLE IF NOT EXISTS chat_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_id VARCHAR(255),
      data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(chat_id) REFERENCES chat_ids(chat_id)
    );
  `);
};

module.exports = { pool, createTables };
