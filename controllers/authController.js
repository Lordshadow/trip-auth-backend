const admin = require('../firebase'); 
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { email, password, phoneNumber } = req.body; 

  try {
    
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    console.log("User created in Firebase:", userRecord.uid);

    const newUser = new User({
      email,
      firebaseUID: userRecord.uid,
      phoneNumber, 
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    
    if (userRecord) {
      const token = await admin.auth().createCustomToken(userRecord.uid);

      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
