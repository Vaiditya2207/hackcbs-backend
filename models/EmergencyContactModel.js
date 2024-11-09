const { pool } = require('./db');

/**
 * Create a new emergency contact.
 * @param {Object} contact - Emergency contact details.
 * @param {Function} callback - Callback function.
 */
const createEmergencyContact = (contact, callback) => {
  const { id, user_id, name, relationship, phone_number, email } = contact;
  pool.query(
    'INSERT INTO emergency_contacts (id, user_id, name, relationship, phone_number, email) VALUES (?, ?, ?, ?, ?, ?)',
    [id, user_id, name, relationship, phone_number, email],
    callback
  );
};

/**
 * Get all emergency contacts for a user.
 * @param {string} user_id - User ID.
 * @param {Function} callback - Callback function.
 */
const getEmergencyContactsByUserId = (user_id, callback) => {
  pool.query(
    'SELECT * FROM emergency_contacts WHERE user_id = ?',
    [user_id],
    callback
  );
};

/**
 * Update an emergency contact.
 * @param {Object} contact - Updated contact details.
 * @param {Function} callback - Callback function.
 */
const updateEmergencyContact = (contact, callback) => {
  const { id, name, relationship, phone_number, email } = contact;
  pool.query(
    'UPDATE emergency_contacts SET name = ?, relationship = ?, phone_number = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, relationship, phone_number, email, id],
    callback
  );
};

/**
 * Delete an emergency contact.
 * @param {string} id - Contact ID.
 * @param {Function} callback - Callback function.
 */
const deleteEmergencyContact = (id, callback) => {
  pool.query(
    'DELETE FROM emergency_contacts WHERE id = ?',
    [id],
    callback
  );
};

module.exports = {
  createEmergencyContact,
  getEmergencyContactsByUserId,
  updateEmergencyContact,
  deleteEmergencyContact
};
