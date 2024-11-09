const { findNearestHospitals } = require('../utils/hospitalLocator');

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of the first location.
 * @param {number} lon1 - Longitude of the first location.
 * @param {number} lat2 - Latitude of the second location.
 * @param {number} lon2 - Longitude of the second location.
 * @returns {number} - Distance in kilometers.
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Implementation...
};

/**
 * Handles the request to find the nearest hospitals.
 * Expects longitude and latitude in the request body.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getNearestHospitals = async (req, res) => {
  const { long: longitude, lat: latitude } = req.body;
  
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return res.status(400).json({ error: 'Longitude and latitude must be numbers.' });
  }
  
  try {
    const hospitals = await findNearestHospitals(longitude, latitude);
    res.status(200).json({ hospitals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve nearest hospitals.' });
    
  }
};

module.exports = { getNearestHospitals };
