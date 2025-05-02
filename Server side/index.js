const express = require('express');
const app = express();
const cors = require('cors');
const webPush = require('web-push');

const PATH = 8000;
const userRoutes = require('./Routes/userRoutes.js');
const reservationRoutes = require('./Routes/reservationRoute.js')
const loginRoute = require('./Routes/login.js');
const bodyParser = require('body-parser');
const bookingRoute = require('./Routes/bookingRoute.js');
const session = require('express-session')
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;
const VAPIDKEY = process.env.WEB_PUSH_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

webPush.setVapidDetails(
  'mailto:annetaliya@gmail.com',
  PUBLIC_KEY,
  VAPIDKEY,

)

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






app.listen(PATH , () => {console.log(`app is listening on port ${PATH}`)})
module.exports= webPush;