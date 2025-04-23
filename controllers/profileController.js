const Profile = require('../models/Profile');

const getUserProfile = async (req, res) => {
  try {
    const user = await Profile.findOne({ firebaseUID: req.params.firebaseUID });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user profile.' });
  }
};

module.exports = { getUserProfile };
