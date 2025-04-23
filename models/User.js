const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true }, 
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
