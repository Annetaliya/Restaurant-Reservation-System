const express = require('express');
const app = express();
const cors = require('cors');
const cookieSession = require('cookie-session')
const PATH = 8000;
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

const userRoutes = require('./Routes/userRoutes.js');
const reservationRoutes = require('./Routes/reservationRoute.js')
const loginRoute = require('./Routes/login.js');
const bodyParser = require('body-parser');
const bookingRoute = require('./Routes/bookingRoute.js');
//const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());



const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
})

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

io.on('connection', (socket) => {
    console.log('Admin connected')

    socket.on('disconnect', () => {
        console.log('Admin disconnected')
    })
})

app.set("io", io)


server.listen(PATH , () => {console.log(`app is listening on port ${PATH}`)})