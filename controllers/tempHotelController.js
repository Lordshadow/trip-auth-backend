const TempHotelBooking = require('../models/TempHotelBooking');

const tempBookHotel = async (req, res) => {
    const { firebaseUID, hotel, location, checkIn, checkOut } = req.body;

    try {
        const booking = new TempHotelBooking({
            firebaseUID,
            hotel,
            location,
            checkIn,
            checkOut
        });

        await booking.save();
        res.status(201).json({ message: 'Temporary booking successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Temporary booking failed' });
    }
};

module.exports = {
    tempBookHotel
};
