const express = require('express');
const router = express.Router();
const { addAirport, getAllAirports , getTotalAirports } = require('../models/airportModel');

const {addFlight, getAllFlights,  getFlightsByCriteria , getTotalFlights, getHighestBookedFlight , getMostCrowdedDepartureAirport2025 , getMostCrowdedArrivalAirport2025 } = require('../models/flightModel');
const { getBookingsByFlight } = require('../controllers/bookingController');




// Route to render the Flight Bookings page
router.get('/bookings', async (req, res) => {
    try {
        let bookings = [];
        const flightId = req.query.flightId;
        
        if (flightId) {
            bookings = await getBookingsByFlight(flightId);
        }

        res.render('admin/bookings', { bookings });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});




router.get('/', async (req, res) => {
    try {
        const totalAirports = await getTotalAirports();
        const totalFlights = await getTotalFlights();
        const highestBookedFlight = await getHighestBookedFlight();
        const mostCrowdedDeparture = await getMostCrowdedDepartureAirport2025();
        const mostCrowdedArrival = await getMostCrowdedArrivalAirport2025();

        res.render('admin/index', {
            totalAirports,
            totalFlights,
            highestBookedFlight,
            mostCrowdedDeparture,
            mostCrowdedArrival
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).send('Server Error');
    }
});
// Admin Dashboard Home
router.get('/', (req, res) => {
    res.render('admin/index');
});

// Airports Page
router.get('/airports', async (req, res) => {
    const airports = await getAllAirports();
    res.render('admin/airports', { airports });
});

// Flights Page
router.get('/flights', async (req, res) => {
    const flights = await getAllFlights();
    res.render('admin/flights', { flights });
});



module.exports = router;
