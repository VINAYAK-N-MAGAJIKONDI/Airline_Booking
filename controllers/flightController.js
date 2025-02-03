const { addFlight, getAllFlights } = require('../models/flightModel');


const createFlight = async (req, res) => {
  const { flightNumber, departureTime, arrivalTime, price, departureAirport, arrivalAirport } = req.body;

  try {
    await addFlight(flightNumber, departureTime, arrivalTime, price, departureAirport, arrivalAirport);
    res.status(201).json({ message: 'Flight added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const listFlights = async (req, res) => {
  try {
    const flights = await getAllFlights();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createFlight, listFlights };
