const { addAirport, getAllAirports } = require('../models/airportModel');

const createAirport = async (req, res) => {
  const { airportCode, airportName, city } = req.body;

  try {
    await addAirport(airportCode, airportName, city);
    res.status(201).json({ message: 'Airport added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const listAirports = async (req, res) => {
  try {
    const airports = await getAllAirports();
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createAirport, listAirports };
