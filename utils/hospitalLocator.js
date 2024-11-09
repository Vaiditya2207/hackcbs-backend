const axios = require('axios');

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of the first location.
 * @param {number} lon1 - Longitude of the first location.
 * @param {number} lat2 - Latitude of the second location.
 * @param {number} lon2 - Longitude of the second location.
 * @returns {number} - Distance in kilometers.
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Fetches the nearest hospitals using Overpass API based on longitude and latitude.
 * @param {number} longitude - The longitude coordinate.
 * @param {number} latitude - The latitude coordinate.
 * @returns {Promise<Object|null>} - A promise that resolves to the nearest hospital object or null if no hospitals are found.
 */
const findNearestHospitals = async (longitude, latitude) => {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${latitude},${longitude});
      way["amenity"="hospital"](around:5000,${latitude},${longitude});
      relation["amenity"="hospital"](around:5000,${latitude},${longitude});
    );
    out center;
  `;
  
  try {
    const response = await axios.post(overpassUrl, `data=${encodeURIComponent(query)}`);
    const hospitals = response.data.elements.map(element => {
      // Extract latitude and longitude based on element type
      let lat, lon;
      if (element.type === 'node') {
        lat = element.lat;
        lon = element.lon;
      } else if (element.type === 'way' || element.type === 'relation') {
        lat = element.center.lat;
        lon = element.center.lon;
      }
      
      // Calculate distance from the provided coordinates
      const distance = calculateDistance(latitude, longitude, lat, lon);
      
      return {
        ...element,
        distance, // Add distance property
      };
    });
    
    // Sort hospitals by distance in ascending order
    hospitals.sort((a, b) => a.distance - b.distance);
    
    if (hospitals.length === 0) {
      return null;
    }

    const nearest = hospitals[0];
    
    return {
      hospital_name: nearest.tags.name || 'Unknown',
      location: { latitude: nearest.lat, longitude: nearest.lon },
      distance: Number(nearest.distance.toFixed(2)),
    };
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};


// (async function () {
//     console.log(await findNearestHospitals(77.0871366, 28.963677))
// }());

module.exports = { findNearestHospitals };
