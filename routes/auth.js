const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign-In route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Directly compare the passwords (no hashing)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
