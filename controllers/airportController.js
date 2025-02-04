const { addAirport, getAllAirports } = require('../models/airportModel');

const createAirport = async (req, res) => {
  console.log(req.body , "this is the body");
  const { airportCode, airportName, city } = req.body;

  // Check if all required fields are provided
  if (!airportCode || !airportName || !city) {
      return res.status(400).json({
          error: 'Missing required fields',
          message: 'airportCode, airportName, and city are required fields.'
      });
  }

  try {
      // Attempt to add the airport
      await addAirport(airportCode, airportName, city);
      res.status(201).json({ message: 'Airport added successfully' });
  } catch (error) {
      // Log the error details to the console for debugging purposes
      console.error('Error adding airport:', error);

      // Handle specific MySQL errors
      if (error.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ error: 'Airport code already exists. Please provide a unique code.' });
      } else if (error.code === 'ER_BAD_FIELD_ERROR') {
          res.status(400).json({ error: 'Invalid field(s) provided. Please check your input.' });
      } else {
          res.status(500).json({
              error: 'Server error',
              details: error.message,  // Provide the error message in the response
          });
      }
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
