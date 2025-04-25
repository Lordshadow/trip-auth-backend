const express = require('express');
const router = express.Router();
const { checkAvailability, tempBookHotel } = require('../controllers/hotelController');

router.post('/check-availability', checkAvailability);
router.post('/temp-book', tempBookHotel);

module.exports = router;
