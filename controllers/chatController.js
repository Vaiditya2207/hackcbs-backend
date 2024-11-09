const {pool} = require('../models/db.js');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const {
  getChatsByUserId,
  getChatDataByChatId,
  createChat,
  addChatData,
  deleteChatByChatId,
  deleteUserById,
  getChatByChatId,
} = require('../models/ChatModel');
const { sendSMS } = require('../utils/smsNotification.js');

const { findNearestHospitals } = require('../utils/hospitalLocator.js')

// Create a chat
const createChatHandler = (req, res) => {
  const { subject } = req.body;
  const chat_id = uuidv4();
  const user = req.user.id; // Use authenticated user's ID
  createChat(chat_id, user, subject, (error) => {
    if (error) return res.status(500).send(error);
    res.status(201).send({ chat_id });
  });
};

// Fetch all chat IDs of the user
const getUserChats = (req, res) => {
  const user = req.user.id; // Use authenticated user's ID
  getChatsByUserId(user, (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json(results);
  });
};

// Fetch data of a single chat
const getChatData = (req, res) => {
  const { chat_id } = req.params;

  getChatDataByChatId(chat_id, (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json(results[0] ? results[0].data : []);
  });
};

// Add new chat data to a chat
const addChatDataHandler = (req, res) => {
  const { chat_id } = req.params; // 'chat_id' from URL
  const { data } = req.body;

  // Validate data structure
  if (!data || typeof data !== 'object' || !data.role || !data.msg) {
    return res.status(400).json({ error: 'Invalid chat message format.' });
  }

  // Ensure the authenticated user owns the chat
  getChatByChatId(chat_id, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Chat not found');
    if (results[0].user_id !== req.user.id && results[0].chat_id !== 'ai') {
      return res.status(403).send('Access denied');
    }

    // Assuming the user is the sender, notify the other participants
    const userId = req.user.id;
    const chat = results[0];
    // Fetch device tokens of the recipient(s)
    pool.query('SELECT device_tokens FROM users WHERE id = ?', [chat.user_id], (error, userResults) => {
      if (error) return res.status(500).send(error);
      if (userResults.length === 0) return res.status(404).send('User not found');

      const deviceTokens = JSON.parse(userResults[0].device_tokens || '[]');
      if (deviceTokens.length > 0) {
        sendNotification(
          deviceTokens,
          'New Message',
          `You have a new message in chat: ${chat.subject}`
        );
      }

      // Add chat data
      addChatData(chat_id, data, (error) => {
        if (error) return res.status(500).send(error);
        res.status(201).send('Chat data added');
      });
    });
  });
};

// Delete a chat
const deleteChat = (req, res) => {
  const { chat_id } = req.params;
  const user_id = req.user.id;

  getChatByChatId(chat_id, (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.length === 0) return res.status(404).send('Chat not found');
    if (results[0].user_id !== user_id) return res.status(403).send('Access denied');

    deleteChatByChatId(chat_id, (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send('Chat deleted');
    });
  });
};

// Delete a user
const deleteUser = (req, res) => {
  const user_id = req.user.id; // Use authenticated user's ID

  deleteUserById(user_id, (error) => {
    if (error) return res.status(500).send(error);
    res.status(200).send('User deleted');
  });
};

// Function to handle emergency
const handleEmergency = async (req, res, aiResponse) => {
  try {
    // Wait for hospital data
    const nearestHospital = await findNearestHospitals(req.headers.long, req.headers.lat);
    
    // Query emergency contacts after getting hospital data
    pool.query('SELECT * FROM emergency_contacts WHERE user_id = ?', [req.user.id], (error, results) => {
      if (error) return res.status(500).json({ error: 'Database error.' });
      
      // Send notifications to each emergency contact
      if (results.length !== 0) {
        results.forEach((contact) => {
          const { name, phone_number } = contact;
          sendSMS(phone_number, `Emergency detected. Please contact ${req.user.first_name} immediately. !!!MEDICAL EMERGENCY!!! nearest hospital details: ${JSON.stringify(nearestHospital)}`);
        });
      }

      res.status(200).json({
        message: 'Emergency detected. Please seek immediate medical attention.',
        details: aiResponse,
        extras: results.length === 0 ? 'No emergency contacts found.' : "Messages sent to emergency contacts.",
        nearestHospital: nearestHospital
      });
    });
  } catch (err) {
    console.error("Error Finding Nearest Hospitals:", err);
    res.status(500).json({
      message: 'Emergency detected but error finding nearby hospitals',
      details: aiResponse,
      error: err.message
    });
  }
};

// Modified handleAI controller
const handleAI = async (req, res) => {
  try {
    const { id: chat_id } = req.query;
    const { data } = req.body;

    if (!chat_id || !data || !data.role || !data.msg) {
      return res.status(400).json({ error: 'Invalid request parameters.' });
    }

    // Fetch existing messages
    pool.query('SELECT data FROM chat_ids WHERE chat_id = ?', [chat_id], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (results.length === 0) return res.status(404).json({ error: 'Chat not found.' });

      let messages;
      try {
        messages = JSON.parse(results[0].data) || [];
      } catch (parseError) {
        messages = [];
      }

      // Add system message if not present
      if (messages.length === 0 || messages[0].role !== 'system') {
        messages.unshift({
          role: 'system',
          msg: 'You are a medical chatbot. Provide accurate diagnoses and solutions based on the symptoms provided. If the symptoms provided by the user are too serious or life-threatening, please start your response with Emergency.',
        });
      }

      // Add user's message
      messages.push({ role: data.role, msg: data.msg });

      // Limit messages to last 10
      if (messages.length > 10) messages = messages.slice(messages.length - 10);

      // Call Cohere API with system message and user messages
      const response = await axios.post('https://api.cohere.com/v2/chat', {
        model: 'command-r-plus-08-2024',
        messages: messages.map(m => ({
          role: m.role,
          content: m.msg,
        })),
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEN_API_KEY}`,
        },
      });

      // Extract AI response
      let aiMsg;
      if (typeof response.data.message === 'string') {
        aiMsg = response.data.message.trim();
      } else if (response.data.content && typeof response.data.content === 'string') {
        aiMsg = response.data.content.trim();
      } else if (response.data.message && Array.isArray(response.data.message.content)) {
        // Extract text from each content item and join them
        aiMsg = response.data.message.content.map(item => item.text || '').join(' ').trim();
      } else if (response.data.message && typeof response.data.message.text === 'string') {
        aiMsg = response.data.message.text.trim();
      } else {
        aiMsg = JSON.stringify(response.data).trim();
      }

      // Ensure aiMsg is a string
      if (typeof aiMsg !== 'string') {
        aiMsg = String(aiMsg);
      }

      // Check for emergency
      if (aiMsg.toLowerCase().startsWith('emergency')) {
        // Append AI response
        messages.push({ role: 'ai', msg: aiMsg });

        // Update messages in DB
        pool.query('UPDATE chat_ids SET data = ? WHERE chat_id = ?', [JSON.stringify(messages), chat_id], (updateErr) => {
          if (updateErr) return res.status(500).json({ error: 'Database update error.' });
          // Call handleEmergency function
          handleEmergency(req, res, aiMsg);
        });
      } else {
        // Append AI response
        messages.push({ role: 'ai', msg: aiMsg });

        // Update messages in DB
        pool.query('UPDATE chat_ids SET data = ? WHERE chat_id = ?', [JSON.stringify(messages), chat_id], (updateErr) => {
          if (updateErr) return res.status(500).json({ error: 'Database update error.' });
          res.status(200).json({ aiResponse: aiMsg });
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  getUserChats,
  getChatData,
  createChat: createChatHandler,
  addChatData: addChatDataHandler,
  deleteChat,
  deleteUser,
  handleAI,
  handleEmergency
};
