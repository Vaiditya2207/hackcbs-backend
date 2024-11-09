const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

const createTables = () => {
  // Create users table
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      phone_number VARCHAR(20) UNIQUE,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      weight FLOAT,
      height FLOAT,
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      device_tokens JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Create emergency_contacts table
  pool.query(`
    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255),
      name VARCHAR(100),
      relationship VARCHAR(50),
      phone_number VARCHAR(20),
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // ...any other table creations...
};

module.exports = { pool, createTables };
