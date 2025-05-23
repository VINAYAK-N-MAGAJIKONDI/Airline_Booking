const db = require('../config/db');

const addAirport = async (airportCode, airportName, city) => {
  const [result] = await db.execute(
    'INSERT INTO Airport (airportCode, airportName, city) VALUES (?, ?, ?)',
    [airportCode, airportName, city]
  );
  return result;
};

const getTotalAirports = async () => {
  const [rows] = await db.execute('SELECT COUNT(*) AS totalAirports FROM Airport');
  return rows[0].totalAirports;
};


const getAllAirports = async () => {
  const [rows] = await db.execute('SELECT * FROM Airport');
  return rows;
};

module.exports = { addAirport, getAllAirports , getTotalAirports};
