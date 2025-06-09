const express = require("express");
const app = express();
const cors = require("cors");
//const serverless = require('serverless-http')

//const PATH = 8000;
const userRoutes = require("./api/userRoutes.js");
const reservationRoutes = require("./api/reservationRoute.js");
const loginRoute = require("./api/login.js");
const bodyParser = require("body-parser");
const bookingRoute = require("./api/bookingRoute.js");
const subscribe = require("./api/subscription.js");
const session = require("express-session");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://restaurant-reservation-sy-git-9196bf-annettes-projects-70970dfb.vercel.app",
  "https://restaurant-reservation-system-livid.vercel.app",
];



app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://restaurant-reservation-system-annettes-projects-70970dfb.vercel.app' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  credentials: true
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: IS_PRODUCTION,
      httpOnly: true,
      sameSite: IS_PRODUCTION ? 'none' : 'lax'
      
    }
  })
);

app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/login", loginRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/subscribe", subscribe);

app.get("/api/", (req, res) => {
  res.send("API is running successfully!");
});

module.exports = app;
