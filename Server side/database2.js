const mysql = require('mysql2/promise')

let pool;

function getpool () {
   if (!pool) {
      pool = mysql.createPool({
       host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      });

   }
   return pool;

}



 
 async function initDB() {
   try {
     const connection  = await getpool().getConnection()
      console.log('connected to mysql Database')

      await connection.execute( 
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
      `);
      
      console.log('User table was successfully created')


      await connection.execute( `
      CREATE TABLE IF NOT EXISTS reservations(
      id VARCHAR(255) PRIMARY KEY,
      tableNumber INT UNIQUE,
      guestNumber INT,
      price INT,
      status ENUM('available', 'reserved') DEFAULT 'available',
      floorLevel ENUM('Level 1', 'Level 2', 'Level 3') NOT NULL

         );
      `);
      
      console.log('Successfully created reservations table')

      await connection.execute( `
         CREATE TABLE IF NOT EXISTS booking(
         id VARCHAR(255) NOT NULL PRIMARY KEY,
         userId VARCHAR(255) NOT NULL,
         reservationId VARCHAR(255) NOT NULL,
         bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
         status ENUM('pending','confirmed', 'cancelled' ) NOT NULL DEFAULT 'confirmed',
         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
         FOREIGN KEY (reservationId) REFERENCES reservations(id) ON DELETE CASCADE
         );
      `);
   
      console.log('Created booking table successfully')

      await connection.execute( `
         CREATE TABLE IF NOT EXISTS subscriptions(
         id VARCHAR(255) PRIMARY KEY,
         subscriptions TEXT NOT NULL
         );
      `);
      
      console.log('Created subscription table successfully')

      connection.release();
   } catch (error) {
      console.log('Connection to database failed', error.message)


   }
 }

initDB()



  module.exports = {
   getDB: ()=> getpool(),
  };

 