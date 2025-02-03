const express = require('express');
const { createAirport, listAirports } = require('../controllers/airportController');

const router = express.Router();

router.post('/', createAirport);  // Add airport
router.get('/', listAirports);    // Get all airports

module.exports = router;
