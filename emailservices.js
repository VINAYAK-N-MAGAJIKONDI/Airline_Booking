require('dotenv').config();  // Load environment variables from .env file
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

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

// Create the transporter using OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,  // Email User from .env
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: await getAccessToken(),
  }
});

// Function to send an email
const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

