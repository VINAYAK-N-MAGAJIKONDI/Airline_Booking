const express = require('express');
const { addSeatsToFlight, bookSeatForFlight } = require('../controllers/seatController');

const router = express.Router();

// Add seats to a flight (admin only)
router.post('/add', addSeatsToFlight);

// Book a seat for a customer
router.post('/book', bookSeatForFlight);

module.exports = router;
