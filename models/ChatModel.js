const pool = require('./db');

const createChatTables = () => {
  // Create chat_ids table with a JSON 'data' field without default value
  pool.query(`
    CREATE TABLE IF NOT EXISTS chat_ids (
      chat_id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255),
      subject VARCHAR(255),
      data JSON, -- Removed DEFAULT '[]'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Remove chat_data table creation as it's no longer needed
  // pool.query(`
  //   CREATE TABLE IF NOT EXISTS chat_data (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     chat_id VARCHAR(255),
  //     data JSON,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  //     FOREIGN KEY(chat_id) REFERENCES chat_ids(chat_id)
  //   );
  // `);
};

// Get all chats by user ID
const getChatsByUserId = (user_id, callback) => {
  pool.query('SELECT * FROM chat_ids WHERE user_id = ?', [user_id], callback);
};

// Ensure 'getChatDataByChatId' function is correct
const getChatDataByChatId = (chat_id, callback) => {
  pool.query('SELECT data FROM chat_ids WHERE chat_id = ?', [chat_id], callback);
};

// Get chat by chat ID
const getChatByChatId = (chat_id, callback) => {
  pool.query('SELECT * FROM chat_ids WHERE chat_id = ?', [chat_id], callback);
};

// Create a new chat with empty data if not provided
const createChat = (chat_id, user_id, subject, callback) => {
  pool.query(
    'INSERT INTO chat_ids (chat_id, user_id, subject, data) VALUES (?, ?, ?, ?)',
    [chat_id, user_id, subject, JSON.stringify([])], // Initialize data as empty array
    callback
  );
};

// Ensure 'addChatData' function is correct
const addChatData = (chat_id, newMessage, callback) => {
  pool.query(
    'SELECT data FROM chat_ids WHERE chat_id = ?',
    [chat_id],
    (err, results) => {
      if (err) return callback(err);

      let messages = [];
      if (results.length > 0 && results[0].data) {
        try {
          messages = JSON.parse(results[0].data);
          if (!Array.isArray(messages)) {
            messages = [];
          }
        } catch (parseError) {
          messages = [];
        }
      }

      messages.push(newMessage);
      if (messages.length > 10) messages = messages.slice(messages.length - 10);

      pool.query(
        'UPDATE chat_ids SET data = ? WHERE chat_id = ?',
        [JSON.stringify(messages), chat_id],
        callback
      );
    }
  );
};

// Delete chat by chat ID
const deleteChatByChatId = (chat_id, callback) => {
  pool.query('DELETE FROM chat_ids WHERE chat_id = ?', [chat_id], callback);
};

// Ensure 'ai' chat exists
const ensureAiChatExists = (callback) => {
  pool.query('SELECT * FROM chat_ids WHERE chat_id = ?', ['ai'], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) {
      // Create 'ai' chat entry with empty data
      pool.query(
        'INSERT INTO chat_ids (chat_id, user_id, subject, data) VALUES (?, ?, ?, ?)',
        ['ai', 'system', 'AI Chat', '[]'], // Initialize data as empty array
        callback
      );
    } else {
      callback(null);
    }
  });
};

module.exports = {
  createChatTables,
  getChatsByUserId,
  getChatDataByChatId,
  getChatByChatId,
  createChat,
  addChatData,
  deleteChatByChatId,
  ensureAiChatExists,
};
