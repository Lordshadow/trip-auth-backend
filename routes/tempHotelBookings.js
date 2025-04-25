const express = require('express');
const router = express.Router();
const TempHotelBooking = require('../models/TempHotelBooking');

// Get all temporary hotel bookings
router.get('/', async (req, res) => {
    try {
        const tempBookings = await TempHotelBooking.find();
        res.status(200).json(tempBookings);
    } catch (err) {
        console.error('Error fetching temporary hotel bookings:', err);
        res.status(500).json({ message: 'Error fetching temporary hotel bookings' });
    }
});

// Create a temporary hotel booking
router.post('/book', async (req, res) => {
    const { firebaseUID, hotel, location, checkIn, checkOut } = req.body;

    if (!firebaseUID || !hotel || !location || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const tempBooking = new TempHotelBooking({ firebaseUID, hotel, location, checkIn, checkOut });
        await tempBooking.save();

        res.status(201).json({ success: true, message: 'Temporary booking created successfully' });
    } catch (error) {
        console.error('Error creating temporary hotel booking:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Export the router
module.exports = router;