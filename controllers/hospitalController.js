const { findNearestHospitals } = require('../utils/hospitalLocator');

/**
 * Handles the request to find the nearest hospitals.
 * Expects longitude and latitude in the request body.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getNearestHospitals = async (req, res) => {
  let { longitude, latitude } = req.body;
  longitude = parseFloat(longitude);
  latitude = parseFloat(latitude);
  console.log(longitude, latitude);
  try {
    const hospitals = await findNearestHospitals(longitude, latitude);
    console.log(hospitals);
    res.status(200).json({ hospitals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve nearest hospitals.' });
    
  }
};

module.exports = { getNearestHospitals };
