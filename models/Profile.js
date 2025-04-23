const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firebaseUID: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phoneNumber: { type: String },
   // name: { type: String }, // Optional, can be added later
  });
  
  module.exports = mongoose.model('users', profileSchema);
