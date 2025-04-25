const Hotel = require('../models/Hotel');

const checkAvailability = async (req, res) => {
    const { location, checkIn, checkOut } = req.body;

    try {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // 🔍 Find hotels for the location
        const hotels = await Hotel.find({ location });
        const results = [];

        for (const hotel of hotels) {
            // 🧠 Check for overlapping permanent bookings
            const overlappingPermanent = hotel.bookings.filter(booking => {
                const start = new Date(booking.checkIn);
                const end = new Date(booking.checkOut);
                return checkInDate <= end && checkOutDate >= start;
            });

            if (overlappingPermanent.length < hotel.count) {
                results.push({
                    hotel: hotel.hotel,
                    ratePerDay: hotel.ratePerDay,
                    rating: hotel.rating || 4,
                    availableRooms: hotel.count - overlappingPermanent.length
                });
            }
        }

        res.status(200).json({
            isAvailable: results.length > 0,
            availableHotels: results
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    checkAvailability
};
