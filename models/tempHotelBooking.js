const mongoose = require('mongoose');

const tempHotelBookingSchema = new mongoose.Schema({
    firebaseUID: { type: String, required: true },
    hotel: { type: String, required: true },
    location: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TempHotelBooking', tempHotelBookingSchema);
