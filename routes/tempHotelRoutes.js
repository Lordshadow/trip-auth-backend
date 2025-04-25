    const express = require('express');
    const router = express.Router();
    const { tempBookHotel } = require('../controllers/tempHotelController');

    router.post('/temp-book', tempBookHotel);

    module.exports = router;
