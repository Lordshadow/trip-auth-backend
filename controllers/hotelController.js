const Hotel = require('../models/Hotel');

const checkAvailability = async (req, res) => {
    const { location, hotel, checkInDate, checkOutDate } = req.body;

    if (!location || !checkInDate || !checkOutDate) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }

    try {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // If specific hotel is requested
        if (hotel) {
            const selectedHotel = await Hotel.findOne({ 
                location: location,
                hotel: hotel 
            });

            if (!selectedHotel) {
                return res.status(404).json({
                    success: false,
                    message: 'Hotel not found'
                });
            }

            const overlappingBookings = selectedHotel.bookings.filter(booking => {
                const bookingStart = new Date(booking.checkIn);
                const bookingEnd = new Date(booking.checkOut);
                return checkIn <= bookingEnd && checkOut >= bookingStart;
            });

            const availableRooms = selectedHotel.count - overlappingBookings.length;

            return res.status(200).json({
                success: true,
                isAvailable: availableRooms > 0,
                availableHotels: [{
                    hotel: selectedHotel.hotel,
                    ratePerDay: selectedHotel.ratePerDay,
                    rating: selectedHotel.rating || 4,
                    availableRooms: availableRooms
                }]
            });
        }

        // If no specific hotel, return all available hotels
        const hotels = await Hotel.find({ location });
        const results = hotels.map(hotel => {
            const overlappingBookings = hotel.bookings.filter(booking => {
                const bookingStart = new Date(booking.checkIn);
                const bookingEnd = new Date(booking.checkOut);
                return checkIn <= bookingEnd && checkOut >= bookingStart;
            });

            const availableRooms = hotel.count - overlappingBookings.length;

            return {
                hotel: hotel.hotel,
                ratePerDay: hotel.ratePerDay,
                rating: hotel.rating || 4,
                availableRooms: availableRooms
            };
        }).filter(hotel => hotel.availableRooms > 0);

        return res.status(200).json({
            success: true,
            isAvailable: results.length > 0,
            availableHotels: results
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    checkAvailability
};
