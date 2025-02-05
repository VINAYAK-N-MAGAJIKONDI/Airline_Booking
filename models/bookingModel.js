const db = require('../config/db');

const createBooking = async (customerId, flightId, bookingDate) => {
  const [result] = await db.execute(
    `INSERT INTO Booking (customerId, flightId, bookingDate) VALUES (?, ?, ?)`,
    [customerId, flightId, bookingDate]
  );
  return result;
};

const checkFlightExists = async (flightId) => {
  const [rows] = await db.execute('SELECT * FROM Flight WHERE flightId = ?', [flightId]);
  return rows.length > 0;
};

const bookFlight = async (req, res) => {
  const { customerId, flightId } = req.body;
  const bookingDate = new Date().toISOString().split('T')[0]; // Get today's date

  try {
    // Check if the flight exists before booking
    const flightExists = await checkFlightExists(flightId);
    if (!flightExists) {
      return res.status(400).json({ error: 'Flight not found' });
    }

    // Proceed with booking
    await createBooking(customerId, flightId, bookingDate);
    res.status(201).json({ message: 'Flight booked successfully' });
  } catch (error) {
    console.error('Error booking flight:', error);
    res.status(500).json({ error: error.message });
  }
};




const getBookingsByCustomer = async (customerId) => {
  const [rows] = await db.execute(
    `SELECT b.bookingId, b.bookingDate, f.flightId, f.flightNumber, f.departureTime, f.arrivalTime, f.price,
            da.airportName AS departureAirport, aa.airportName AS arrivalAirport,
            COALESCE(s.seatNumber, 'NA') AS seatNumber
     FROM Booking b
     JOIN Flight f ON b.flightId = f.flightId
     JOIN Airport da ON f.departureAirport = da.airportCode
     JOIN Airport aa ON f.arrivalAirport = aa.airportCode
     LEFT JOIN Seat s ON b.bookingId = s.bookingId
     WHERE b.customerId = ?`,
    [customerId]
  );
  return rows;
};

module.exports = { createBooking, getBookingsByCustomer };
