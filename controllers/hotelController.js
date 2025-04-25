const Hotel = require('../models/Hotel');
const TempHotelBooking = require('../models/TempHotelBooking');

const checkAvailability = async (req, res) => {
    const { location, checkIn, checkOut } = req.body;

    if (!location || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const hotels = await Hotel.find({ location });
        const results = [];

        for (const hotel of hotels) {
            const overlappingPermanent = hotel.bookings.filter(booking => {
                const start = new Date(booking.checkIn);
                const end = new Date(booking.checkOut);
                return checkInDate <= end && checkOutDate >= start;
            });

            const overlappingTemp = await TempHotelBooking.find({
                hotel: hotel.hotel,
                location: hotel.location,
                $or: [
                    { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } }
                ]
            });

            const totalOverlapping = overlappingPermanent.length + overlappingTemp.length;
            const availableRooms = hotel.count - totalOverlapping;

            if (availableRooms > 0) {
                results.push({
                    hotel: hotel.hotel,
                    ratePerDay: hotel.ratePerDay,
                    rating: hotel.rating || 4,
                    availableRooms: availableRooms
                });
            }
        }

        res.status(200).json({
            success: true,
            isAvailable: results.length > 0,
            availableHotels: results
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

const tempBookHotel = async (req, res) => {
    const { firebaseUID, hotel, location, checkIn, checkOut } = req.body;

    if (!firebaseUID || !hotel || !location || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const tempBooking = new TempHotelBooking({ firebaseUID, hotel, location, checkIn, checkOut });
        await tempBooking.save();

        res.status(201).json({ success: true, message: 'Temporary booking created successfully' });
    } catch (error) {
        console.error('Error creating temporary booking:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    checkAvailability,
    tempBookHotel
};
