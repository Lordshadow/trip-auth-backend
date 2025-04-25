const TempBooking = require('../models/TempBooking');

const createTempBooking = async (req, res) => {
    const { firebaseUID, vehicleId, vehicleName, pickupDate, returnDate } = req.body;

    try {
        const pickupDateObj = new Date(pickupDate);
        const returnDateObj = new Date(returnDate);

        // Check if there's an existing non-expired temporary booking for the same vehicle and overlapping dates
        const existingTempBooking = await TempBooking.findOne({
            vehicleId,
            vehicleName,
            $or: [
                { pickupDate: { $lte: returnDateObj }, returnDate: { $gte: pickupDateObj } }
            ]
        });

        if (existingTempBooking) {
            return res.status(409).json({ message: 'This vehicle is already temporarily booked for the selected or overlapping dates.' });
        }

        const tempBooking = new TempBooking({
            firebaseUID,
            vehicleId,
            vehicleName,
            pickupDate: pickupDateObj,
            returnDate: returnDateObj
        });

        const savedTempBooking = await tempBooking.save();
        res.status(201).json({ message: 'Temporary booking created successfully', tempBookingId: savedTempBooking._id });

    } catch (err) {
        console.error('Error creating temporary booking:', err);
        res.status(500).json({ message: 'Error creating temporary booking' });
    }
};

module.exports = {
    createTempBooking
};