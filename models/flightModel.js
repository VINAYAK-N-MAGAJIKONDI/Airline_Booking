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
module.exports = { addFlight, getAllFlights,  getFlightsByCriteria };
