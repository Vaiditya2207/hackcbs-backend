const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const {
  createUser,
  getUserByEmail,
  updateUserDetails,
} = require('../models/UserModel');

// Signup controller
const signup = async (req, res) => {
  const {
    phone_number,
    first_name,
    last_name,
    weight,
    height,
    email,
    password,
    device_tokens, // Ensure device_tokens can be provided during signup
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  createUser(
    {
      id,
      phone_number,
      first_name,
      last_name,
      weight,
      height,
      email,
      password: hashedPassword,
      device_tokens: device_tokens || [],
    },
    (error) => {
      if (error) return res.status(500).json({ error });
      
      // Send welcome notification
      if (device_tokens && device_tokens.length > 0) {
        sendNotification(
          device_tokens,
          'Welcome!',
          `Hello ${first_name}, welcome to our app!`
        );
      }

      res.status(201).json({ message: 'User created' });
    }
  );
};

// Signin controller
const signin = (req, res) => {
  const { email, password, device_token } = req.body;

  getUserByEmail(email, async (error, results) => {
    if (error) return res.status(500).json({ error });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Incorrect password' });

    // Update device_tokens if a new device_token is provided
    let updatedDeviceTokens = user.device_tokens || [];
    if (device_token && !updatedDeviceTokens.includes(device_token)) {
      updatedDeviceTokens.push(device_token);
      updateUserDetails(
        {
          id: user.id,
          phone_number: user.phone_number,
          first_name: user.first_name,
          last_name: user.last_name,
          weight: user.weight,
          height: user.height,
          email: user.email,
          device_tokens: updatedDeviceTokens,
        },
        (updateError) => {
          if (updateError) return res.status(500).json({ error: 'Failed to update device tokens' });
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ message: 'Signed in', token, user });
  });
};

// Update user details controller
const updateUser = (req, res) => {
  const userId = req.user.id;
  const {
    phone_number,
    first_name,
    last_name,
    weight,
    height,
    email,
  } = req.body;

  updateUserDetails(
    {
      id: userId,
      phone_number,
      first_name,
      last_name,
      weight,
      height,
      email,
    },
    (error) => {
      if (error) return res.status(500).json({ error });
      res.status(200).json({ message: 'User updated' });
    }
  );
};

// Update device token controller
const updateDeviceToken = (req, res) => {
  const userId = req.user.id;
  const { device_token } = req.body;

  if (!device_token) {
    return res.status(400).json({ error: 'Device token is required.' });
  }

  // Fetch current device tokens
  getUserByEmail(req.user.email, (error, results) => {
    if (error) return res.status(500).json({ error: 'Database error.' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found.' });

    let deviceTokens = results[0].device_tokens || [];
    if (!deviceTokens.includes(device_token)) {
      deviceTokens.push(device_token);
      updateUserDetails(
        {
          id: userId,
          phone_number: results[0].phone_number,
          first_name: results[0].first_name,
          last_name: results[0].last_name,
          weight: results[0].weight,
          height: results[0].height,
          email: results[0].email,
          device_tokens: deviceTokens,
        },
        (updateError) => {
          if (updateError) return res.status(500).json({ error: 'Failed to update device tokens.' });
          res.status(200).json({ message: 'Device token updated.' });
        }
      );
    } else {
      res.status(200).json({ message: 'Device token already exists.' });
    }
  });
};

module.exports = { signup, signin, updateUser, updateDeviceToken };

