const { checkSeatAvailability, bookSeat, addSeat } = require('../models/seatModel');
const db = require('../config/db');





const addSeatsToFlight = async (req, res) => {
  const { flightId, seatNumbers } = req.body;

  try {
    // Prepare seat data for insertion
    const seatData = seatNumbers.map(seatNumber => `('${seatNumber}', ${flightId}, true)`);

    // Log to check seatData format
    console.log('Seat Data:', seatData);

    // Join the seat data into a single string for the VALUES clause
    const query = `INSERT INTO Seat (seatNumber, flightId, isAvailable) VALUES ${seatData.join(', ')}`;

    // Log query to debug
    console.log('Generated Query:', query);

    // Execute the query
    const [insertResult] = await db.execute(query);

    // Update totalSeats in the Flight table
    const [updateResult] = await db.execute(
      'UPDATE Flight SET totalSeats = totalSeats + ? WHERE flightId = ?',
      [seatNumbers.length, flightId]
    );

    res.status(201).json({ message: `${seatNumbers.length} seats added successfully` });
  } catch (error) {
    console.error('Error adding seats:', error);
    res.status(500).json({ error: error.message });
  }
};


const bookSeatForFlight = async (req, res) => {
  const { customerId, flightId, seatNumber, bookingId } = req.body;

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

module.exports = { addSeatsToFlight, bookSeatForFlight };
