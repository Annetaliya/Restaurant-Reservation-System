const express = require('express');
const app = express();
const cors = require('cors');


const PATH = 8000;
const userRoutes = require('./api/userRoutes.js');
const reservationRoutes = require('./api/reservationRoute.js')
const loginRoute = require('./api/login.js');
const bodyParser = require('body-parser');
const bookingRoute = require('./api/bookingRoute.js');
const subscribe = require('./api/subscription.js');
const session = require('express-session')
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;



//const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,              
  }));

app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))


app.use('/users', userRoutes);
app.use('/reservations', reservationRoutes);
app.use('/login', loginRoute);
app.use('/bookings', bookingRoute)
app.use('/subscribe', subscribe)

module.exports = app;