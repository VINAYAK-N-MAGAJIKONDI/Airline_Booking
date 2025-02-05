const { checkSeatAvailability, bookSeat, addSeat, getSeatsByFlight } = require('../models/seatModel');
const db = require('../config/db');

const addSeatsToFlight = async (req, res) => {
  const { flightId, seatNumbers } = req.body;

  try {
    // Fetch existing seats for the flight
    const existingSeats = await getSeatsByFlight(flightId);
    const existingSeatNumbers = existingSeats.map(seat => seat.seatNumber);

    // Filter out seats that are already added
    const newSeatNumbers = seatNumbers.filter(seatNumber => !existingSeatNumbers.includes(seatNumber));

    if (newSeatNumbers.length === 0) {
      return res.status(400).json({ error: 'All selected seats are already added to the flight.' });
    }

    // Prepare seat data for insertion
    const seatData = newSeatNumbers.map(seatNumber => `('${seatNumber}', ${flightId}, true)`);

    // Join the seat data into a single string for the VALUES clause
    const query = `INSERT INTO Seat (seatNumber, flightId, isAvailable) VALUES ${seatData.join(', ')}`;

    // Execute the query
    await db.execute(query);

    // Update totalSeats in the Flight table
    await db.execute(
      'UPDATE Flight SET totalSeats = totalSeats + ? WHERE flightId = ?',
      [newSeatNumbers.length, flightId]
    );

    res.status(201).json({ message: `${newSeatNumbers.length} seats added successfully` });
  } catch (error) {
    console.error('Error adding seats:', error);
    res.status(500).json({ error: error.message });
  }
};


const bookSeatForFlight = async (req, res) => {
  const customerId = req.user.customerId; // Extract customerId from the JWT token
  const { flightId, seatNumber , bookingId } = req.body;

  try {
    // Check if seat is available before booking
    const seatAvailable = await checkSeatAvailability(flightId, seatNumber);
    if (!seatAvailable) {
      return res.status(400).json({ error: 'Seat is not available' });
    }


    // Proceed with booking the seat
    await bookSeat(flightId, seatNumber, bookingId);
    res.status(200).json({ message: 'Seat booked successfully' });
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ error: error.message });
  }
};

const getSeatsForFlightper = async (req, res) => {
  const { flightId } = req.params;

  try {
    const seats = await getSeatsByFlight(flightId);
    res.status(200).json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addSeatsToFlight, bookSeatForFlight, getSeatsForFlightper };
