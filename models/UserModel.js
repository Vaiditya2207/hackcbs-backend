const {pool} = require('./db');

const createUsersTable = () => {
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
};

// Create a new user
const createUser = (user, callback) => {
  const {
    id,
    phone_number,
    first_name,
    last_name,
    weight,
    height,
    email,
    password,
    device_tokens, // Include device_tokens
  } = user;

  pool.query(
    'INSERT INTO users (id, phone_number, first_name, last_name, weight, height, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      phone_number,
      first_name,
      last_name,
      weight,
      height,
      email,
      password
    ],
    callback
  );
};

// Get user by email
const getUserByEmail = (email, callback) => {
  pool.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

// Update user details
const updateUserDetails = (user, callback) => {
  const {
    id,
    phone_number,
    first_name,
    last_name,
    weight,
    height,
    email
  } = user;

  pool.query(
    'UPDATE users SET phone_number = ?, first_name = ?, last_name = ?, weight = ?, height = ?, email = ? WHERE id = ?',
    [
      phone_number,
      first_name,
      last_name,
      weight,
      height,
      email,
      id,
    ],
    callback
  );
};

// Delete user by ID
const deleteUserById = (user_id, callback) => {
  pool.query('DELETE FROM users WHERE id = ?', [user_id], callback);
};

module.exports = {
  createUsersTable,
  createUser,
  getUserByEmail,
  updateUserDetails,
  deleteUserById
};
