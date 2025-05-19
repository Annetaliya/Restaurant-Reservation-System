const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log("Connected to the SQLite database");
    db.run("PRAGMA foreign_keys = ON")
   
    

    db.run(
      `CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      tableNumber INTEGER UNIQUE,
      guestNumber INTEGER,
      price INTEGER,
      status TEXT CHECK(status IN ('available', 'reserved')) DEFAULT 'available',
      floorLevel TEXT CHECK(floorLevel IN ('Level 1', 'Level 2', 'Level 3')) NOT NULL
      )`,
      (err) => {
        if (err) {
          console.log('Failed to create reservation table', err.message)
        } else {
          console.log('Reservation table created successfuly')

          function insertReservation(tableNumber, guestNumber, price, status, floorLevel) {
            const insert = 'INSERT INTO reservations(id, tableNumber, guestNumber, price, status, floorLevel) VALUES (?,?,?,?,?,?)'
            db.run(insert, [
              uuidv4(),
              tableNumber,
              guestNumber,
              price,
              status,
              floorLevel
            ], (err) => {
              if (err) {
                console.log('Error inserting a reservation', err.message)
              } else {
                console.log('Reservation created successfully')
              }
            })
          }
          db.get('SELECT COUNT (*) AS count FROM reservations', (err,row) => {
            if (err) {
              console.log('Error checking reservation', err.message)
            } else if (row.count === 0) {
              insertReservation(1, 4, 26, 'available', 'Level 1' );
              insertReservation(2, 6, 26, 'available', 'Level 1' );
              insertReservation(3, 4, 24, 'available', 'Level 1' );
              insertReservation(4, 2, 20, 'available', 'Level 1');

            } else {
              console.log('Reservation already exist, skipping insertion')
            }
          })   
        }
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS booking (
      id TEXT NOT NULL PRIMARY KEY,
      userId TEXT NOT NULL,
      reservationId TEXT NOT NULL,
      bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) NOT NULL DEFAULT 'confirmed',
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (reservationId) REFERENCES reservations(id) ON DELETE CASCADE

      )`,(err) => {
        if (err) {
          console.log('Error creating booking table', err.message)
        } else {
          console.log('Booking Table was created')
        }
      }
    );

   
    db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      subscription TEXT NOT NULL

      )`, (err) => {
        if (err) {
          console.log('Error creating Subscrition Table', err.message)
        } else {
          console.log('Successfully created the Subscription Table')
        }
      }

    )
    db.run(`CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      firstName TEXT,
      secondName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      phone TEXT UNIQUE,
      role TEXT DEFAULT 'user',
      CONSTRAINT email__phone_unique UNIQUE (email, phone)
      )`, (err) => {
        if (err) {
          console.log('Error creating user table', err.message)
        } else {
          console.log('User Table was created')
        }

      }

    )
    
  }
});
module.exports = db;
