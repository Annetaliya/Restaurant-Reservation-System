const db =  require('../database');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();



router.post('/', (req, res) => {
    const {userId, reservationId, bookingDate} = req.body;

    if (!userId || !reservationId || !bookingDate) {
        console.log()
        return res.status(400).json({error: 'Missing userId or reservationId'})
    }
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
                        const notificationsId = uuidv4()
        
                    const notificationSql = `INSERT INTO notifications (id, message, bookingId) VALUES (?,?,?)`;
                    db.run(notificationSql, [notificationsId, `New booking received`, bookingId], function (err) {
                        if (err) {
                            console.error('Error saving notifications', err.message)
                            return res.status(500).json({error: 'database error'})
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
               
        
              
        
                
        
                // res.status(201).json({
                //     'message': 'success',
                //     'data': {
                //         bookingId,
                //         userId,
                //         reservationId,
                //         bookingDate,
                //         status
                //     }
                // })
            })
        

        })
    }
    Promise.all(reservationIds.map(reservationId => insertBookings(reservationId)))
        .then(result => {
            res.status(201).json({
                message: 'Booking created Succsessfully',
                data: result
            })
        })
        .catch(err => {
            console.log('Error creating bookings', err.message)
            res.status(500).json({ error: 'Database error'})
        })

   
   
})

router.get('/notifications', (req, res) => {
    const sql = `SELECT * FROM notifications ORDER BY createdAt DESC`
    db.all(sql, [], (err,rows) => {
        if (err) {
            console.log(err.message)
            return res.status(500).json({error: 'database error'})
        }
        res.json({ data: rows})
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
                        reservations.tableNumber, reservations.guestNumber, reservations.floorLevel
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