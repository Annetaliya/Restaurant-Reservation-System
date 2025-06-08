const express = require('express');
const app = express();
const cors = require('cors');
//const serverless = require('serverless-http')


//const PATH = 8000;
const userRoutes = require('./api/userRoutes.js');
const reservationRoutes = require('./api/reservationRoute.js')
const loginRoute = require('./api/login.js');
const bodyParser = require('body-parser');
const bookingRoute = require('./api/bookingRoute.js');
const subscribe = require('./api/subscription.js');
const session = require('express-session')
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://restaurant-reservation-system-doafu7qaz.vercel.app',
 'https://restaurant-reservation-sy-git-9196bf-annettes-projects-70970dfb.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin))
    }
  },
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true
}))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

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

app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

module.exports = app;