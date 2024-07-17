const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET_KEY } = require('../config'); // Import SECRET_KEY from config file
const router = express.Router();



router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.send('User registered');
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY);

    // Send user details along with token in response
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role // Include any other relevant user details
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
