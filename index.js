require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const emergencyContactRoutes = require('./routes/emergencyContacts'); // Added line
const { createTables } = require('./models/db'); // Added line
const hospitalsRoutes = require('./routes/hospitals'); // Added line

// Initialize database tables
createTables(); // Added line

app.use(express.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/api', chatRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes); // Added line
app.use('/api/hospitals', hospitalsRoutes); // Added line

// ...existing code...

// Start the server
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
