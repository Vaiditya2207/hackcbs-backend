const { v4: uuidv4 } = require('uuid');
const {
  createEmergencyContact,
  getEmergencyContactsByUserId,
  updateEmergencyContact,
  deleteEmergencyContact
} = require('../models/EmergencyContactModel');

/**
 * Create a new emergency contact for a user.
 */
const createContact = (req, res) => {
  const user_id = req.user.id;
  const { name, relationship, phone_number, email } = req.body;

  if (!name || !relationship || !phone_number) {
    return res.status(400).json({ error: 'Name, relationship, and phone number are required.' });
  }

  const contact = {
    id: uuidv4(),
    user_id,
    name,
    relationship,
    phone_number,
    email: email || null
  };

  createEmergencyContact(contact, (error) => {
    if (error) return res.status(500).json({ error: 'Failed to create emergency contact.' });
    res.status(201).json({ message: 'Emergency contact created successfully.', contact });
  });
};

/**
 * Get all emergency contacts for the authenticated user.
 */
const getContacts = (req, res) => {
  const user_id = req.user.id;

  getEmergencyContactsByUserId(user_id, (error, results) => {
    if (error) return res.status(500).json({ error: 'Failed to retrieve emergency contacts.' });
    res.status(200).json({ contacts: results });
  });
};

/**
 * Update an existing emergency contact.
 */
const updateContact = (req, res) => {
  const { id, name, relationship, phone_number, email } = req.body;

  if (!id || !name || !relationship || !phone_number) {
    return res.status(400).json({ error: 'ID, name, relationship, and phone number are required.' });
  }

  const contact = { id, name, relationship, phone_number, email: email || null };

  updateEmergencyContact(contact, (error, results) => {
    if (error) return res.status(500).json({ error: 'Failed to update emergency contact.' });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Emergency contact not found.' });
    res.status(200).json({ message: 'Emergency contact updated successfully.', contact });
  });
};

/**
 * Delete an emergency contact.
 */
const deleteContact = (req, res) => {
  const { id } = req.params;

  deleteEmergencyContact(id, (error, results) => {
    if (error) return res.status(500).json({ error: 'Failed to delete emergency contact.' });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Emergency contact not found.' });
    res.status(200).json({ message: 'Emergency contact deleted successfully.' });
  });
};

module.exports = {
  createContact,
  getContacts,
  updateContact,
  deleteContact
};
