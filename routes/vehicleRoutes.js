const express = require('express');
const router = express.Router();
const {
    checkAvailability,
    tempBookVehicle
} = require('../controllers/vehicleController');

router.post('/check-availability', checkAvailability);
router.post('/temp-book', tempBookVehicle);

module.exports = router;