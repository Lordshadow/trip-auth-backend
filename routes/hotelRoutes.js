const express = require('express');
const router = express.Router();
const { checkAvailability, tempBookHotel, getHotelDetails } = require('../controllers/hotelController');

router.post('/check-availability', checkAvailability);
router.post('/temp-book', tempBookHotel);
router.post('/details', getHotelDetails);

module.exports = router;
