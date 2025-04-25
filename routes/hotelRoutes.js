const express = require('express');
const router = express.Router();
const { checkAvailability, tempBookHotel, getHotelDetails, getAvailableRooms } = require('../controllers/hotelController');

// Define routes
router.post('/check-availability', checkAvailability);
router.post('/temp-book', tempBookHotel);
router.post('/details', getHotelDetails);
router.post('/available-rooms', getAvailableRooms);

module.exports = router;
