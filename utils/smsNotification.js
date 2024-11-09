const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_FROM_NUMBER = '+13164489551';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

/**
 * Send SMS using Twilio API
 * @param {string} to - Recipient phone number
 * @param {string} body - Message content
 */
const sendSMS = async (to, body) => {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  try {
    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', TWILIO_FROM_NUMBER);
    params.append('Body', body);

    const response = await axios.post(url, params, {
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN
      }
    });

    console.log('SMS sent:', response.data.sid);
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendSMS };
