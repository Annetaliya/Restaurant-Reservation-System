const express = require('express');
const app = express();
const cors = require('cors');
const cookieSession = require('cookie-session')
const PATH = 8000;
const userRoutes = require('./Routes/userRoutes.js')
const reservationRoutes = require('./Routes/reservationRoute.js')
const loginRoute = require('./Routes/login.js');
const bodyParser = require('body-parser');
const bookingRoute = require('./Routes/bookingRoute.js')
// const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

app.use(
    cookieSession({
        name: 'restaurant-session',
        keys: ["COOKIE_SECRET"],
        httpOnly: true,
    })
);

app.use('/users', userRoutes);
app.use('/reservations', reservationRoutes);
app.use('/login', loginRoute);
app.use('/bookings', bookingRoute)


app.listen(PATH , () => {console.log(`app is listening on port ${PATH}`)})