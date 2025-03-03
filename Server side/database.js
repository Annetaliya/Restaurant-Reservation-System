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

          const insert =
            "INSERT INTO user(id, firstName, secondName, email, password, phone) VALUES (?,?,?,?,?,?)";
          db.run(insert, [
            uuidv4(),
            "first",
            "admin",
            "admin@example.com",
            md5("admin123456"),
            "07025000",
          ], (err) => {
            if (err) {
                console.log('Error in inserting user', err.message)
            } else {
                console.log('User added successfuly')
            }
          });
          db.run(insert, [
            uuidv4(),
            "Annette",
            "Aliya",
            "annet@example.com",
            md5("annet145"),
            "07456789"
          ])
        }
      }
    );
  }
});
module.exports = db;
