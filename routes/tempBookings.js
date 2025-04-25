const express = require('express');
const router = express.Router();
const tempBookingController = require('../controllers/tempBookingController');

router.post('/create', tempBookingController.createTempBooking);

module.exports = router;