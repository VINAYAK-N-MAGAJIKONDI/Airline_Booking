const express = require('express');
const { createFlight, listFlights } = require('../controllers/flightController');

const router = express.Router();

router.post('/', createFlight);  // Add flight
router.get('/', listFlights);    // Get all flights

module.exports = router;
