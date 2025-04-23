const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: String,
  phoneNumber: String,
}, { timestamps: true });

module.exports = mongoose.model('Profile', userSchema);
