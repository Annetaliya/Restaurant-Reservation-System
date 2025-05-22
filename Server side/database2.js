const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Annette',
  database: 'ebay',
};
 let db;
 async function initDB() {
   try {
      db = await mysql.createConnection(dbConfig)
      console.log('connected to mysql Database')

      const usersTable = 
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
      await db.execute(usersTable)
      console.log('User table was successfully created')


      const reservationsTable = `
      CREATE TABLE IF NOT EXISTS reservations(
      id VARCHAR(255) PRIMARY KEY,
      tableNumber INT UNIQUE,
      guestNumber INT,
      price INT,
      status ENUM('available', 'reserved') DEFAULT 'available',
      floorLevel ENUM('Level 1', 'Level 2', 'Level 3') NOT NULL

         );
      `;
      await db.execute(reservationsTable)
      console.log('Successfully created reservations table')

      const bookingTable = `
         CREATE TABLE IF NOT EXISTS booking(
         id VARCHAR(255) NOT NULL PRIMARY KEY,
         userId VARCHAR(255) NOT NULL,
         reservationId VARCHAR(255) NOT NULL,
         bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
         status ENUM('pending','confirmed', 'cancelled' ) NOT NULL DEFAULT 'confirmed',
         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
         FOREIGN KEY (reservationId) REFERENCES reservations(id) ON DELETE CASCADE
         );
      `;
      await db.execute(bookingTable)
      console.log('Created booking table successfully')

      const sqlQuery = `
         CREATE TABLE IF NOT EXISTS subscriptions(
         id VARCHAR(255) PRIMARY KEY,
         subscriptions VARCHAR(255) NOT NULL
         );
      `;
      await db.execute(sqlQuery) 
      console.log('Created subscription table successfully')



   } catch (error) {
      console.log('Connection to database failed', error.message)


   }
 }

initDB()



  module.exports = {
   getDB: ()=> db,
  };

 