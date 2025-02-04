require('dotenv').config();
const db = require('../config/db');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { createBooking, getBookingsByCustomer } = require('../models/bookingModel');

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,  // Client ID from .env
  process.env.GOOGLE_CLIENT_SECRET,  // Client Secret from .env
  'https://developers.google.com/oauthplayground'  // The redirect URI you configured in Google Cloud Console
);

// Set credentials using Access and Refresh token
oauth2Client.setCredentials({
  access_token: process.env.AccessToken,  // Access Token from .env
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN  // Refresh Token from .env
});

// Get Access Token (automatically refreshes if expired)
const getAccessToken = async () => {
  const accessToken = await oauth2Client.getAccessToken();
  return accessToken.token;
};

// Check Flight Availability
const checkFlightAvailability = async (flightId) => {
  const [totalSeatsRows] = await db.execute('SELECT totalSeats FROM Flight WHERE flightId = ?', [flightId]);
  const [bookedSeatsRows] = await db.execute(
    'SELECT COUNT(*) AS bookedSeats FROM Seat WHERE flightId = ? AND bookingId IS NOT NULL',
    [flightId]
  );

  const totalSeats = totalSeatsRows[0].totalSeats;
  const bookedSeats = bookedSeatsRows[0].bookedSeats;

  const availableSeats = totalSeats - bookedSeats;
  return availableSeats > 0;
};

// Book a Flight
const bookFlight = async (req, res) => {
  const { customerId, flightId } = req.body;
  const bookingDate = new Date().toISOString().split('T')[0]; // Get today's date

  try {
    // Check if the flight exists before booking
    const flightExists = await checkFlightExists(flightId);
    if (!flightExists) {
      return res.status(400).json({ error: 'Flight not found' });
    }

    // Check if there are available seats
    const isAvailable = await checkFlightAvailability(flightId);
    if (!isAvailable) {
      return res.status(400).json({ error: 'No available seats for this flight' });
    }

    // Proceed with booking
    await createBooking(customerId, flightId, bookingDate);
    res.status(201).json({ message: 'Flight booked successfully' });

    // Send booking confirmation email
    await sendEmailNotification(customerId, flightId);

  } catch (error) {
    console.error('Error booking flight:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings for a customer
const getUserBookings = async (req, res) => {
  const { customerId } = req.params;

  try {
    const bookings = await getBookingsByCustomer(customerId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
};

// Send email notification (confirmation)
const sendEmailNotification = async (customerId, flightId) => {
  const customerQuery = await db.execute('SELECT * FROM Customer WHERE customerId = ?', [customerId]);
  const flightQuery = await db.execute('SELECT * FROM Flight WHERE flightId = ?', [flightId]);

  const customer = customerQuery[0][0];
  const flight = flightQuery[0][0];

  if (customer && flight) {
    // Get the latest access token
    const accessToken = await getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,  // Email User from .env
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender's email
      to: customer.Email,           // The customer's email address
      subject: 'Flight Booking Confirmation',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #007bff; text-align: center;">Booking Confirmation</h2>
              <p style="font-size: 16px;">Dear <strong>${customer.Name}</strong>,</p>
              <p style="font-size: 16px;">Thank you for booking with us! Your flight booking has been confirmed. Below are your booking details:</p>
              <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 16px;"><strong>Flight Number</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 16px;">${flight.flightNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 16px;"><strong>Departure Time</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 16px;">${flight.departureTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 16px;"><strong>Destination</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 16px;">${flight.destination}</td>
                </tr>
              </table>
              <p style="font-size: 16px; margin-top: 20px;">If you have any questions or need further assistance, feel free to contact us.</p>
              <p style="font-size: 16px;">We look forward to welcoming you on board!</p>
              <p style="font-size: 16px; text-align: center; color: #007bff;">Best regards,<br>The Airline Team</p>
            </div>
          </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
};




const getBookingsByFlight = async (flightId) => {
  const [rows] = await db.execute(
      `SELECT 
          c.name AS customerName, 
          s.seatNumber 
       FROM Booking b
       JOIN Customer c ON b.customerId = c.customerId
       JOIN Seat s ON b.bookingId = s.bookingId
       WHERE b.flightId = ?`,
      [flightId]
  );
  return rows;
};





module.exports = { bookFlight, getUserBookings , getBookingsByFlight};
