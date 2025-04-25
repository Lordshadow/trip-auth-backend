const Vehicle = require('../models/Vehicle');
const TempBooking = require('../models/TempBooking'); // Import the TempBooking model
const tempBookingController = require('./tempBookingController'); // Import the TempBooking controller

const checkAvailability = async (req, res) => {
    const { vehicleId, pickupDate, returnDate } = req.body;

    try {
        const vehicles = await Vehicle.find({ vehicleId });
        if (!vehicles || vehicles.length === 0) {
            return res.status(404).json({ message: 'No vehicles found with this ID' });
        }

        const pickupDateObj = new Date(pickupDate);
        const returnDateObj = new Date(returnDate);
        const availableVehiclesData = [];

        for (const vehicle of vehicles) {
            // Check for overlapping permanent bookings
            const overlappingPermanent = vehicle.bookings.filter(booking => {
                const bStart = new Date(booking.pickupDate);
                const bEnd = new Date(booking.returnDate);
                return pickupDateObj <= bEnd && returnDateObj >= bStart;
            });

            // Check for overlapping temporary bookings
            const overlappingTemporary = await TempBooking.countDocuments({
                vehicleId: vehicle.vehicleId,
                vehicleName: vehicle.name,
                $or: [
                    { pickupDate: { $lte: returnDateObj }, returnDate: { $gte: pickupDateObj } }
                ]
            });

            // A vehicle instance is available if there are no overlapping permanent OR temporary bookings
            if (overlappingPermanent.length === 0 && overlappingTemporary === 0) {
                availableVehiclesData.push({ name: vehicle.name, dailyRate: vehicle.dailyRate });
            }
        }

        res.status(200).json({
            isAvailable: availableVehiclesData.length > 0,
            availableVehicles: availableVehiclesData,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const tempBookVehicle = async (req, res) => {
    // We are now just passing the request and response objects to the tempBookingController
    return tempBookingController.createTempBooking(req, res);
};

module.exports = {
    checkAvailability,
    tempBookVehicle
};