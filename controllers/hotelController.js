const Hotel = require('../models/Hotel');
const TempHotelBooking = require('../models/TempHotelBooking');

const checkAvailability = async (req, res) => {
    const { location, checkIn, checkOut } = req.body;

    try {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // 🧹 Clean expired temp bookings first
        const expirationTime = 15 * 60 * 1000; // 15 minutes
        const now = new Date();
        await TempHotelBooking.deleteMany({
            createdAt: { $lt: new Date(now - expirationTime) }
        });

        // 🔍 Find hotels and temp bookings for the location
        const hotels = await Hotel.find({ location });
        const tempBookings = await TempHotelBooking.find({
            location,
            $or: [
                { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } }
            ]
        });

        const results = [];

        for (const hotel of hotels) {
            // 🧠 Check for overlapping permanent bookings
            const overlappingPermanent = hotel.bookings.filter(booking => {
                const start = new Date(booking.checkIn);
                const end = new Date(booking.checkOut);
                return checkInDate <= end && checkOutDate >= start;
            });

            // 🧠 Check for overlapping temp bookings
            const overlappingTemp = tempBookings.filter(tempBooking => tempBooking.hotel === hotel.hotel);

            const totalOverlapping = overlappingPermanent.length + overlappingTemp.length;

            if (totalOverlapping < hotel.count) {
                results.push({
                    hotel: hotel.hotel,
                    ratePerDay: hotel.ratePerDay,
                    rating: hotel.rating || 4,
                    availableRooms: hotel.count - totalOverlapping
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
