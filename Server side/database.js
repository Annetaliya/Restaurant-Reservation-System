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
      `CREATE TABLE IF NOT EXISTS user (
            id TEXT PRIMARY KEY,
            firstName TEXT,
            secondName TEXT,
            email TEXT UNIQUE,
            password TEXT,
            phone TEXT UNIQUE,
            CONSTRAINT email__phone_unique UNIQUE (email, phone)
            )`,
      (err) => {
        if (err) {
          console.log("Error in creating user table", err.message);
        } else {
          console.log("User table was created successfully");

          
          function insertUser(firstName, secondName, email, password, phone) {
  
            db.get(
              'SELECT * FROM user WHERE email = ? OR phone = ?',
              [email, phone],
              (err, row) => {
                if(err) {
                  console.error('Error checking for existing user:', err.message)
                } else if(row) {
                  console.log('user already exists', email, phone)
                } else {
                  
                  const insert =
                 "INSERT INTO user(id, firstName, secondName, email, password, phone) VALUES (?,?,?,?,?,?)";
                 db.run(insert, [
                  uuidv4(),
                  firstName,
                  secondName,
                  email,
                  md5(password),
                  phone,

                 ], (err) => {
                  if (err) {
                    console.log(`Error in inserting ${firstName} ${err.message}`)
                  } else {
                    console.log('${firstName} created succsesfully')
                  }
                 })
                }
              }
            )

          }
          insertUser('first', 'admin', 'admin@example.com', 'admin1235', '0723456790')
          insertUser('Annette', 'Aliya', 'aliya@example.com', 'aliya678', '0723456797')
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      tableNumber INTEGER UNIQUE,
      guestNumber INTEGER,
      status TEXT CHECK(status IN ('available', 'reserved')) DEFAULT 'available',
      floorLevel TEXT CHECK(floorLevel IN ('Level 1', 'Level 2', 'Level 3')) NOT NULL
      )`,
      (err) => {
        if (err) {
          console.log('Failed to create reservation table', err.message)
        } else {
          console.log('Reservation table created successfuly')

          function insertReservation(tableNumber, guestNumber, status, floorLevel) {
            const insert = 'INSERT INTO reservations(id, tableNumber, guestNumber, status, floorLevel) VALUES (?,?,?,?,?)'
            db.run(insert, [
              uuidv4(),
              tableNumber,
              guestNumber,
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
          insertReservation(1, 4, 'available', 'Level 1' );
          insertReservation(2, 6, 'available', 'Level 1' );
          insertReservation(3, 4, 'reserved', 'Level 1' );
          insertReservation(4, 2, 'available', 'Level 1');
          

          
        }
      }
    );
  }
});
module.exports = db;
