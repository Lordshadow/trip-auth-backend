const mongoose = require('mongoose');

const tempHotelBookingSchema = new mongoose.Schema({
    firebaseUID: { type: String, required: true },
    hotel: { type: String, required: true },
    location: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // TTL index: expires after 1 hour
}, { timestamps: true });

module.exports = mongoose.models.TempHotelBooking || mongoose.model('TempHotelBooking', tempHotelBookingSchema);