const express = require('express');
const { addSeatsToFlight, bookSeatForFlight  , getSeatsForFlightper} = require('../controllers/seatController');
const verifyToken = require('../middleware/authmiddleware'); // Import Middleware

const router = express.Router();

// Add seats to a flight (admin only)
router.post('/add', addSeatsToFlight);

// Book a seat for a customer
router.post('/book', verifyToken, bookSeatForFlight);


router.get('/:flightId', getSeatsForFlightper);


module.exports = router;
