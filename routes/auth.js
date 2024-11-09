const express = require('express');
const router = express.Router();
const { signup, signin, updateUser, updateDeviceToken } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

// Route to sign up
router.post('/signup', signup);

// Route to sign in
router.post('/signin', signin);

// Route to update user details
router.put('/update', authenticateToken, updateUser);

// Route to update device token
router.put('/update-device-token', authenticateToken, updateDeviceToken);

// Existing route comments
// This can be handled in updateUser or as a separate controller

module.exports = router;