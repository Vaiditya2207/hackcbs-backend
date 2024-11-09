const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { getNearestHospitals } = require('../controllers/hospitalController');

// Route to find the nearest hospitals
router.post('/nearest', authenticateToken, getNearestHospitals);

module.exports = router;
