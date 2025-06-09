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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.endsWith("/")
        ? origin.slice(0, -1)
        : origin;

      if (allowedOrigins.indexOf(normalizedOrigin) === -1) {
        const msg = `CORS not allowed from this origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 204,
  })
);

// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://restaurant-reservation-system-annettes-projects-70970dfb.vercel.app/' : 'http://localhost:3000',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   maxAge: 86400,
//   credentials: true
// }))

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
      sameSite: IS_PRODUCTION ? "lax" : "none",
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);
app.use("/login", loginRoute);
app.use("/bookings", bookingRoute);
app.use("/subscribe", subscribe);

app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

module.exports = app;
