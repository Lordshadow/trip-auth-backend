const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    firebaseUID: String,
    pickupDate: Date,
    returnDate: Date,
}, { _id: false });

const vehicleSchema = new mongoose.Schema({
    vehicleId: String,
    name: String,
    capacity: String,
    count: Number, // Total number of vehicles of this type
    bookings: [bookingSchema],
    dailyRate: Number // Added dailyRate field
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);