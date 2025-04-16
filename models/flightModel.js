const db = require('../config/db');

const addFlight = async (flightNumber, departureTime, arrivalTime, price, departureAirport, arrivalAirport) => {
  const [result] = await db.execute(
    `INSERT INTO Flight (flightNumber, departureTime, arrivalTime, price, departureAirport, arrivalAirport) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [flightNumber, departureTime, arrivalTime, price, departureAirport, arrivalAirport]
  );
  return result;
};

const getAllFlights = async () => {
  const [rows] = await db.execute(
    `SELECT f.*, da.airportName AS departureAirportName, aa.airportName AS arrivalAirportName
     FROM Flight f
     JOIN Airport da ON f.departureAirport = da.airportCode
     JOIN Airport aa ON f.arrivalAirport = aa.airportCode`
  );
  return rows;
};

const getFlightsByCriteria = async (departureAirport, arrivalAirport, date) => {
  const [rows] = await db.execute(
    `SELECT f.*, da.airportName AS departureAirportName, aa.airportName AS arrivalAirportName
     FROM Flight f
     JOIN Airport da ON f.departureAirport = da.airportCode
     JOIN Airport aa ON f.arrivalAirport = aa.airportCode
     WHERE f.departureAirport = ? AND f.arrivalAirport = ? AND DATE(f.departureTime) = ?`,
    [departureAirport, arrivalAirport, date]
  );
  return rows;
};

const getTotalFlights = async () => {
  const [rows] = await db.execute('SELECT COUNT(*) AS totalFlights FROM Flight');
  return rows[0].totalFlights;
};

const getHighestBookedFlight = async () => {
  const [rows] = await db.execute(`
    SELECT f.flightNumber, COUNT(b.bookingId) AS totalBookings
    FROM Flight f
    JOIN Booking b ON f.flightId = b.flightId
    GROUP BY f.flightId, f.flightNumber
    ORDER BY totalBookings DESC
    LIMIT 1
  `);
  return rows[0];
};

const getMostCrowdedDepartureAirport2025 = async () => {
  const [rows] = await db.execute(`
    SELECT da.airportName AS departureAirport, COUNT(b.bookingId) AS totalDepartures
    FROM Booking b
    JOIN Flight f ON b.flightId = f.flightId
    JOIN Airport da ON f.departureAirport = da.airportCode
    WHERE YEAR(f.departureTime) = 2025
    GROUP BY da.airportCode, da.airportName
    ORDER BY totalDepartures DESC
    LIMIT 1
  `);
  return rows[0];
};

const getMostCrowdedArrivalAirport2025 = async () => {
  const [rows] = await db.execute(`
    SELECT aa.airportName AS arrivalAirport, COUNT(b.bookingId) AS totalArrivals
    FROM Booking b
    JOIN Flight f ON b.flightId = f.flightId
    JOIN Airport aa ON f.arrivalAirport = aa.airportCode
    WHERE YEAR(f.arrivalTime) = 2025
    GROUP BY aa.airportCode, aa.airportName
    ORDER BY totalArrivals DESC
    LIMIT 1
  `);
  return rows[0];
};

module.exports = { addFlight, getAllFlights,  getFlightsByCriteria , getTotalFlights, getHighestBookedFlight , getMostCrowdedDepartureAirport2025 , getMostCrowdedArrivalAirport2025};
