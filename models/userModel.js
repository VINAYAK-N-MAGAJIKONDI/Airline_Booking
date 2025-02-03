const db = require('../config/db');

const createUser = async (fullName, email, hashedPassword) => {
  const [result] = await db.execute(
    'INSERT INTO Customer (Name, Email, Password) VALUES (?, ?, ?)',
    [fullName, email, hashedPassword]
  );
  return result;  // Fix: Ensure return is properly structured
};

const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM Customer WHERE Email = ?', [email]);
  return rows[0];
};

module.exports = { createUser, getUserByEmail };
