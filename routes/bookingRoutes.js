const express = require('express');
const { bookFlight, getUserBookings } = require('../controllers/bookingController');
const verifyToken = require('../middleware/authmiddleware'); // Import Middleware

const router = express.Router();

router.post('/book', verifyToken, bookFlight); // Protected Route
router.get('/my-bookings/:customerId', verifyToken, getUserBookings); // Protected Route

module.exports = router;
