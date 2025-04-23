const User = require('../models/User');

// Register user - just save info, don't create Firebase user again
const registerUser = async (req, res) => {
  const { name,email, firebaseUID, phoneNumber } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUID });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists in database.' });
    }

    // Create new user record in MongoDB
    const newUser = new User({
      name,
      email,
      firebaseUID,
      phoneNumber,
      
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Backend register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// (Optional) Login route if needed later
const loginUser = async (req, res) => {
  const { firebaseUID } = req.body;

  try {
    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ message: 'User not found in DB.' });
    }

    res.status(200).json({ message: 'Login success', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
