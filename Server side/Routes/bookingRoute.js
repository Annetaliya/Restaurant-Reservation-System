const db =  require('../database');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const webpush = require('web-push');
const VAPIDKEY = process.env.WEB_PUSH_KEY;
const { getDB } = require('../database2.js');
const database2 = require('../database2.js');

webpush.setVapidDetails(
  'mailto:annetaliya@gmail.com',
  'BGQOtwfwG5bzN0Vhyb_hIk_GhMXzkhlnnnk4vMjTBZq5_ZfwY69gcKhGq08TUY0hOtkbVHm1PnqfTVU_ehpBoMQ',
  VAPIDKEY,

)


async function notify (payload) {
    const db = getDB();
    try {
        const [rows] = db.execute('SELECT id, subscription FROM subscriptions')
        for (const row of rows) {
            const subscription = JSON.parse(row.subscription);
            try {
                await webpush.sendNotification(subscription, JSON.stringify(payload))
                console.log(`Push sent to subscription ID ${row.id}`)

            } catch (err) {
                console.log('Push error', err.status, err.body)
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.log(`Subscription ${row.id} no longer available`)
                    await deleteSubscription(row.id)
                }
            }
        }
    } catch (err) {
        console.error('Error getting subscriptions', err);
    }
   
}

async function deleteSubscription(id) {
    const db = getDB();
    try {
        await db.execute('DELETE FROM subscriptions WHERE id = ?', [id])
        console.log(`Deleted subscription with id ${id}`);

    } catch (error) {
         console.log('Failed to delete', error.message)
    }
}

router.post('/', async (req, res) => {
    const {userId, reservationId, bookingDate} = req.body;

    if (!userId || !reservationId || !bookingDate) {

        return res.status(400).json({error: 'Missing userId or reservationId'})
    }

    const db = getDB();
    const connection = await db.getConnection();
    const reservationIds = Array.isArray(reservationId) ? reservationId : [reservationId]

    let bookedTables = [];
    let results = [];
    try {
        await connection.beginTransaction();

        for (const resId of reservationIds) {
            const bookingId = uuidv4();
            const status = 'confirmed';

            const insertSql =  `INSERT INTO booking (id, userId, reservationId, bookingDate, status) VALUES (?,?,?,?,?)`;
            await connection.execute(insertSql, [bookingId, userId, resId, bookingDate, status])

            //update reservation status
            const updateSql = `UPDATE reservations SET status = 'reserved' WHERE id  = ?`
            await connection.execute(updateSql, [resId])

            //table number
            const [rows] = await connection.execute(`SELECT tableNumber FROM reservations WHERE id = ?`, [resId])
            if (rows.length > 0) {
                bookedTables.push(rows[0].tableNumber)

            }

            results.push({
                bookingId,
                userId,
                reservationId: resId,
                bookingDate,
                status
            })
        }
        await connection.commit()
        res.status(201).json({
            message: 'Booking created successfully',
            data: results
        })
        const tables = bookedTables.join(', ');
        const bookingId = results[0].bookingId;

        await notify({
            title: 'New booking received',
            body: {
                message: `Tables ${tables} booKed on ${bookingDate.split(' ')[0]}`,
                bookingId
            }
        })

    } catch (error) {
        await connection.rollback();
        console.log('Error creating bookings', err.message)
        res.status(500).json({ error: 'Database error'})

    } finally {
        connection.release()
    }
      
})



router.get('/', async (req, res) => {
    const db = getDB();
    try {
        const sql = `SELECT booking.id, booking.bookingDate, booking.status,
                        user.firstName, user.secondName, user.email, reservations.tableNumber,
                        reservations.guestNumber, reservations.floorLevel
                FROM booking
                JOIN user ON booking.userId = user.id
                JOIN reservations ON booking.reservationId = reservations.id

        `;
        const [rows] = await db.execute(sql);
        res.json({
            data: rows

        })

        
    } catch (error) {
        res.status(500).json({error: error.message})

    }
})

router.get('/:id', async (req, res) => {

    const db = getDB();
    try {
        const sql = `select booking.id, booking.bookingDate, booking.status,
                        user.firstName, user.secondName, user.email,
                        reservations.tableNumber, reservations.guestNumber, reservations.floorLevel
                FROM booking
                JOIN user ON booking.userId = user.id
                JOIN reservations ON booking.reservationId = reservations.id
                WHERE booking.id = ?
                ORDER BY booking.bookingDate DESC;
        `
        const [rows] = await db.execute(sql, [req.params.id])

        if (rows.length === 0) {
           return res.status(404).json({
                "error": "Booking not found" 
            })
        }
         res.json({
            message: "ok",
            "data": rows[0]
        })

    } catch (error) {
        res.status(500).json({error: error.message})

    }
    
})
router.get('/user/:id', (req,res) => {
    const sql = `select booking.id, booking.bookingDate, booking.status,
                        user.firstName, user.secondName, user.email,
                        reservations.tableNumber, reservations.guestNumber, reservations.floorLevel, reservations.price
                FROM booking
                JOIN user ON booking.userId = user.id
                JOIN reservations ON booking.reservationId = reservations.id
                WHERE user.id = ?
                ORDER BY booking.bookingDate DESC;

     `
     db.all(sql, [req.params.id], (err,row) => {
        if (err) {
            console.log(err)
            return res.status(500).json({message: 'server error'})
            
        }
        if (!row) {
            return res.status(400).json({message: 'booking not found'})
        }
        res.json({data: row})

     })
})

router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const {status} = req.body;

    if (!status) {
        return res.status(400).json({error: 'no fields to update'})
    }

    let fieldsToUpdate = [];
    let params = [];

    if (status) {
        fieldsToUpdate.push('status = ?')
        params.push(status)
    }
    params.push(id);
    const sql = `UPDATE booking SET ${fieldsToUpdate.join(', ')} WHERE id = ?`

    db.run(sql, params, function (err) {
        if (err) {
            console.log(err.message)
            return res.status(500).json({error: 'Database error'})
            
        }

        if (this.changes === 0) {
            return res.status(400).json({error: 'booking not found'})
        }

        db.get(`SELECT * FROM booking WHERE id = ?`, [id] , (err, row) => {
            if (err) {
                console.log(err.message)
                return res.status(500).json({error: 'Error fetching updated bookings'})
            }
            
            res.json({
                message: 'updated booking successfuly',
                data: row
            })
        }
    )
       
       
    }

    )
})

router.delete('/:id', (req, res) =>{
   const bookingId = req.params.id;

   const getReservationSql = `SELECT reservationId, userId FROM booking WHERE id = ?`

   db.get(getReservationSql, [bookingId], (err, row) => {
    if (err) {
        console.error('Error fetching reservationId', err.message);
        return res.status(500).json({error: 'database error'})
    }
    if (!row) {
        return res.status(404).json({message: 'booking not found'})
    }
    const { reservationId, userId } = row
    const updateStatusSql = `UPDATE booking SET status = 'cancelled' WHERE id = ?`

   // const sql = `DELETE FROM booking WHERE reservationId = ? AND userId = ?`
    db.run(updateStatusSql, [bookingId], function (err) {
        if (err) {
            console.error('Error deleting bookind')
            return res.status(500).json({error: 'database error'})
        }

        if (this.changes === 0) {
            return res.status(400).json({message: 'booking not found'})
        }

        const reservationSql = `UPDATE reservations SET status = 'available' WHERE id = ?`

        db.run(reservationSql, [reservationId], function (err) {
            if (err) {
                console.error('Error updating reservation status', err.message)
                res.status(500).json({error: 'database error'})
            }
            res.json({message: 'Booking deleted', 'data': row})
        })

    })
   })
})




module.exports = router