const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');


app.use('/api/users', userRoutes);

const airportRoutes = require('./routes/airportRoutes');
app.use('/api/airports', airportRoutes);

const flightRoutes = require('./routes/flightRoutes');
app.use('/api/flights', flightRoutes);


const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const seatRoutes = require('./routes/seatRoutes');
app.use('/api/seats', seatRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.use(express.static('public'));
