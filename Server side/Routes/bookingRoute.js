const db =  require('../database');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


router.post('/', (req, res) => {
    const io = req.app.get('io')
    const {userId, reservationId, bookingDate} = req.body;

    if (!userId || !reservationId || !bookingDate) {
        console.log()
        return res.status(400).json({error: 'Missing userId or reservationId'})
    }

    const bookingId = uuidv4();
    const status = 'pending';
    //const bookingDate = new Date().toISOString().replace('T', ' ').split('.')[0];

    const sql = `INSERT INTO booking (id, userId, reservationId, bookingDate, status) VALUES (?,?,?,?,?)`;
    const params = [bookingId, userId, reservationId, bookingDate, status];

    db.run(sql, params, (err, row) => {
        if (err) {
            console.log('Error creating booking', err.message);
            return res.status(500).json({error: 'database error'})
        }

        const newBooking = {
            bookingId,
            userId,
            reservationId,
            bookingDate,
            status
        }
        io.emit('new booking', newBooking)

        res.status(201).json({
            'message': 'success',
            'data': {
                bookingId,
                userId,
                reservationId,
                bookingDate,
                status
            }
        })
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
                LEFT JOIN user ON booking.userId = user.id
                LEFT JOIN reservations On booking.reservationId = reservations.id
                WHERE booking.id = ?
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

router.patch('/:id', (req, res) => {
    const io = req.app.get('io');
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
        const updatedBooking = {id, status};
        io.emit('confirmed', updatedBooking)
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

   const getReservationSql = `SELECT reservationId FROM booking WHERE id = ?`

   db.get(getReservationSql, [bookingId], (err, row) => {
    if (err) {
        console.error('Error fetching reservationId', err.message);
        return res.status(500).json({error: 'database error'})
    }
    if (!row) {
        return res.status(404).json({message: 'booking not found'})
    }
    const reservationId = row.reservationId

    const sql = `DELETE FROM booking WHERE id = ?`
    db.run(sql, [bookingId], function (err) {
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