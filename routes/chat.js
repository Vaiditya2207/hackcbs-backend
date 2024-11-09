const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const {
  getUserChats,
  getChatData,
  deleteChat,
  deleteUser,
  createChat,
  addChatData,
  handleAI
} = require('../controllers/chatController');

// Route to fetch all chats of a user
router.get('/chats', authenticateToken, getUserChats); // Changed to remove :user_id and use authenticated user

// Route to fetch chat data
router.get('/chat/:chat_id', authenticateToken, getChatData);

// Route to create a new chat
router.post('/chat', authenticateToken, createChat);

// Route to add chat data (messages) to a chat
router.post('/chat/:chat_id', authenticateToken, addChatData);

// Route to delete a chat
router.delete('/chat/:chat_id', authenticateToken, deleteChat);

// Route to delete a user
router.delete('/user', authenticateToken, deleteUser); // Changed to remove :user_id and use authenticated user

// Route to handle AI interactions
router.post('/ai', authenticateToken, handleAI);

module.exports = router;
