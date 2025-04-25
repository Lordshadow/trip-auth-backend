const express = require('express');
const router = express.Router();
const { checkAvailability, getHotelDetails, getAvailableRooms } = require('../controllers/hotelController');
const mongoose = require('mongoose');
const Hotel = require('../models/Hotel'); // Import the Hotel model
const TempHotelBooking = require('../models/TempHotelBooking'); // Import TempHotelBooking model

const tempBookHotel = async (req, res) => {
    const { firebaseUID, hotel, location, checkIn, checkOut, roomCount } = req.body;

    if (!firebaseUID || !hotel || !location || !checkIn || !checkOut || !roomCount) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Check if enough rooms are available
        const hotelData = await Hotel.findOne({ hotel, location });
        if (!hotelData) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }

        const overlappingTemp = await TempHotelBooking.find({
            hotel,
            location,
            $or: [
                { checkIn: { $lte: new Date(checkOut) }, checkOut: { $gte: new Date(checkIn) } }
            ]
        });

        const totalTempRooms = overlappingTemp.reduce((sum, booking) => sum + booking.roomCount, 0);
        const availableRooms = hotelData.count - totalTempRooms;

        if (roomCount > availableRooms) {
            return res.status(400).json({ success: false, message: 'Not enough rooms available' });
        }

        // Create a temporary booking
        const tempBooking = new TempHotelBooking({ firebaseUID, hotel, location, checkIn, checkOut, roomCount });
        await tempBooking.save();

        res.status(201).json({ success: true, message: 'Temporary booking created successfully' });
    } catch (error) {
        console.error('Error creating temporary booking:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Define routes
router.post('/check-availability', checkAvailability);
router.post('/temp-book', tempBookHotel);
router.post('/details', getHotelDetails);
router.post('/available-rooms', getAvailableRooms);

module.exports = router;
