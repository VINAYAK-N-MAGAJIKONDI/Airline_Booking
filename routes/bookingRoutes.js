const express = require('express');
const { bookFlight, getUserBookings , getBookingsByFlight } = require('../controllers/bookingController');

const verifyToken = require('../middleware/authmiddleware'); // Import Middleware

const router = express.Router();

router.post('/book', verifyToken, bookFlight); // Protected Route
router.get('/my-bookings/:customerId', verifyToken, getUserBookings); // Protected Route
router.get('/:id', async (req, res) => {

    const flightId = req.params.id; // Get the flightId from the URL parameters
    try {
        const bookings = await getBookingsByFlight(flightId);
        if (bookings.length > 0) {
            res.status(200).json(bookings); // Return the list of bookings for the flight
        } else {
            res.status(404).json({ message: 'No bookings found for this flight.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;
