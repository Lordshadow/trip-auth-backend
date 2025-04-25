const mongoose = require('mongoose');

const tempBookingSchema = new mongoose.Schema({
    firebaseUID: { type: String, required: true },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, index: { expireAfterSeconds: 3600 } } 
}, { timestamps: true });

module.exports = mongoose.model('TempBooking', tempBookingSchema, 'tempbookings'); 