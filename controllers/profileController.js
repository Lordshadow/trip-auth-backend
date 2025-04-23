const User = require('../models/Profile');

exports.getUserProfile = async (req, res) => {
  try {
    const { firebaseId } = req.params;
    const user = await User.findOne({ firebaseUID: firebaseId }); // updated key

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};
