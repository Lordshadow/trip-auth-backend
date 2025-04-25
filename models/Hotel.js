const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    firebaseUID: String,
    checkIn: Date,
    checkOut: Date,
}, { _id: false });

const hotelSchema = new mongoose.Schema({
    location: String,
    hotel: String,
    ratePerDay: Number, // Changed to Number for calculations
    capacity: Number,
    count: Number,
    bookings: [bookingSchema]
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
