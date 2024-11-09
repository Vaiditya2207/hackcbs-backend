const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const {
  createContact,
  getContacts,
  updateContact,
  deleteContact
} = require('../controllers/emergencyContactController');

const { handleEmergency } = require('../controllers/chatController.js')

// Create a new emergency contact
router.post('/', authenticateToken, createContact);

// Get all emergency contacts for the authenticated user
router.get('/', authenticateToken, getContacts);

// Update an existing emergency contact
router.put('/', authenticateToken, updateContact);

// Delete an emergency contact
router.delete('/:id', authenticateToken, deleteContact);

router.get('/emergency', authenticateToken, handleEmergency);

module.exports = router;
