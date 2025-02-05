const db = require('../config/db');

// Check if a seat is available for a flight
const checkSeatAvailability = async (flightId, seatNumber) => {
  const [rows] = await db.execute(
    'SELECT * FROM Seat WHERE flightId = ? AND seatNumber = ? AND isAvailable = true',
    [flightId, seatNumber]
  );
  return rows.length > 0;
};

// Book a seat for a customer
const bookSeat = async (flightId, seatNumber, bookingId) => {
  const [result] = await db.execute(
    'UPDATE Seat SET isAvailable = false, bookingId = ? WHERE flightId = ? AND seatNumber = ?',
    [bookingId, flightId, seatNumber]
  );
  return result;
};

// Add a seat to a flight (if not already present)
const addSeat = async (flightId, seatNumber) => {
  const [result] = await db.execute(
    'INSERT INTO Seat (seatNumber, flightId, isAvailable) VALUES (?, ?, true)',
    [seatNumber, flightId]
  );
  return result;
};

const getSeatsByFlight = async (flightId) => {
  const [rows] = await db.execute(
    'SELECT seatNumber, isAvailable FROM Seat WHERE flightId = ?',
    [flightId]
  );
  return rows;
};

module.exports = { checkSeatAvailability, bookSeat, addSeat , getSeatsByFlight};
