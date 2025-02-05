const express = require('express');
const { createFlight, listFlights , getFlightsByCondition} = require('../controllers/flightController');

const router = express.Router();

router.post('/', createFlight);  // Add flight
router.get('/', listFlights);    // Get all flights
router.get('/search', getFlightsByCondition); // Get flights by criteria

module.exports = router;
