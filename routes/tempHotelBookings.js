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

// Export the router
module.exports = router;