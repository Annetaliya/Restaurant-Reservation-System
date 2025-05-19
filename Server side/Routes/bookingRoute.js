const db =  require('../database');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const webpush = require('web-push');
const VAPIDKEY = process.env.WEB_PUSH_KEY;

webpush.setVapidDetails(
  'mailto:annetaliya@gmail.com',
  'BGQOtwfwG5bzN0Vhyb_hIk_GhMXzkhlnnnk4vMjTBZq5_ZfwY69gcKhGq08TUY0hOtkbVHm1PnqfTVU_ehpBoMQ',
  VAPIDKEY,

)


function notify (payload) {
    const sql = 'SELECT subscription FROM subscriptions'
    db.all(sql, [], (err, rows) => {
        if (err){
            console.log('Error getting subscriptions')
            return;
        }
        rows.forEach((row) => {
            const subscription = JSON.parse(row.subscription)
            webpush.sendNotification(subscription, JSON.stringify(payload))
            .then(()=> console.log(`Push sent to subscription ID ${row.id}`))
            .catch((err) => {
                console.log('Push error', err.statusCode, err.body)
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.log(`Subscription ${row.id} no longer valid. Deleting...`)
                    deleteSubscription(row.id)

                }
            })
        })
    })
}

function deleteSubscription(id) {
    const sql = `DELETE From subscriptions WHERE id = ?`
    db.run(sql, [id], function(err) {
        if (err) {
            console.log('Failed to delete', err.message)
        }
        console.log(`Deleted subscription with id ${id}`);
    })
}

router.post('/', (req, res) => {
    const {userId, reservationId, bookingDate} = req.body;

    if (!userId || !reservationId || !bookingDate) {
        console.log()
        return res.status(400).json({error: 'Missing userId or reservationId'})
    }
    let bookedTables = []
    const reservationIds = Array.isArray(reservationId) ? reservationId : [reservationId]
    const insertBookings = (resId) => {
        const bookingId = uuidv4();
        const status = 'confirmed';
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO booking (id, userId, reservationId, bookingDate, status) VALUES (?,?,?,?,?)`;
            const params = [bookingId, userId, resId, bookingDate, status];
            db.run(sql, params, (err, row) => {
                if (err) return reject(err)
                const updateReservation = `UPDATE reservations SET status = 'reserved' WHERE id = ?` 
                
                db.run (updateReservation, [resId], (err) => {
                    if (err) return reject(err)
                    
                    const getTableNo = `SELECT tableNumber FROM reservations WHERE id = ?`
                    db.get(getTableNo, [resId], (err, row) => {
                        if (err) return reject(err)
                        if (row) {
                            bookedTables.push(row.tableNumber)
                        }

                    })
                        
                    resolve({
                            bookingId,
                            userId,
                            reservationId: resId,
                            bookingDate,
                            status
                            
                    })
                })
            })
        

        })
    }
    Promise.all(reservationIds.map(reservationId => insertBookings(reservationId)))
        .then(result => {
            res.status(201).json({
                message: 'Booking created Succsessfully',
                data: result
            })
            const bookingId = result[0].bookingId
            const tables = bookedTables.join(', ');
            notify({
                title: 'New booking received',
                body: {
                    message: `Tables ${tables} booked on ${bookingDate.split(' ')[0]}`,
                    bookingId: bookingId
                }
                
            })
            })
        .catch(err => {
            console.log('Error creating bookings', err.message)
            res.status(500).json({ error: 'Database error'})
        })

   
   
})



router.get('/', (req, res) => {
    const sql = `SELECT booking.id, booking.bookingDate, booking.status,
                        user.firstName, user.secondName, user.email, reservations.tableNumber,
                        reservations.guestNumber, reservations.floorLevel
                FROM booking
                JOIN user ON booking.userId = user.id
                JOIN reservations ON booking.reservationId = reservations.id

    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.json({
            'data': rows
        })
    })
})

router.get('/:id', (req, res) => {
    const sql = `select booking.id, booking.bookingDate, booking.status,
                        user.firstName, user.secondName, user.email,
                        reservations.tableNumber, reservations.guestNumber, reservations.floorLevel
                FROM booking
                JOIN user ON booking.userId = user.id
                JOIN reservations ON booking.reservationId = reservations.id
                WHERE booking.id = ?
                ORDER BY booking.bookingDate DESC;
     `

    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return;
        }
        if (!row) {
            return res.status(404).json({ "error": "Booking not found" }); 
        }
        res.json({
            "message": "ok",
            "data": row
        })
    })
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