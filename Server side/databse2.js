const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Annette',
  database: 'your_database',
};
 let db;
 (async () => {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('connected to mysql database')

    } catch(error) {
        console.log('Database connection failed', error)

    }

 }) ();
 try {
    const sqlTableQuery = 
        `CREATE TABLE IF NOT EXISTS users(
        id VARCHAR(255) PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        secondName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(100) UNIQUE,
        role VARCHAR(20) DEFAULT 'user',
        CONSTRAINT email__phone_unique UNIQUE (email, phone)
    );
  `;
  await db.execute(sqlTableQuery)
  console.log('User table was successfully created')

 } catch (error) {
    console.log('Error creating user table', error.message)

 }

 try {
    const sqlQuery = `
    CREATE TABLE IF NOT EXISTS reservations(
    id VARCHAR(255) PRIMARY KEY,
    tableNumber INT UNIQUE,
    guestNumber INT,
    price INT,
    status ENUM('available', 'reserved') DEFAULT 'available',
    floorLevel ENUM('Level 1', 'Level 2', 'Level 3') NOT NULL

    );
    `;
    await db.execute(sqlQuery)
    console.log('Successfully created reservations table')

 } catch (error) {
    console.log('Failed to create reservations table', error.message)
    
 }

 try {
    const sqlQuery = `
    CREATE TABLE IF NOT EXISTS booking(
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    reservatinId VARCHAR(255) NOT NULL,
    bookingDate DATETIME DEFAULT CURRENT_TIMEPSTAMP,
    status ENUM('pending','confirmed', 'cancelled', ) NOT NULL DEFAULT 'confirmed',
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (reservationId) REFERENCES reservations(id) ON DELETE CASCADE
    );
    `;
    await db.execute(sqlQuery)
    console.log('Created booking table successfully')

 } catch (error) {
    console.log('Error creating booking table', error.message)

 }
  try {
    const sqlQuery = `
    CREATE TABLE IF NOT EXISTS subscriptions(
    id VARCHAR(255) PRIMARY KEY,
    subscriptions VARCHAR(255) NOT NULL
    );
    `;
    await db.execute(sqlQuery) 
    console.log('Created subscription table successfully')

  } catch (error) {
    console.log('Error creasting subscriptions table:', error.messGE)

  }

 