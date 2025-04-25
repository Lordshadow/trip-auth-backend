const express = require('express');
const router = express.Router();
const { checkAvailability } = require('../controllers/hotelController');

router.post('/check-availability', checkAvailability);

module.exports = router;
