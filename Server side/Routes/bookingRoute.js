const db =  require('../database');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


router.post('/', (req, res) => {
    const {userId, reservationId} = req.body;

    if (!userId || !reservationId) {
        return res.status(400).json({error: 'Missing userId or reservationId'})
    }

    const bookingId = uuidv4();
    const status = 'pending';
    const bookingDate = new Date().toISOString().split('T')[0]

    const sql = `INSERT INTO booking (id, userId, reservationId, bookingDate, status) VALUES (?,?,?,?,?)`;
    const params = [bookingId, userId, reservationId, bookingDate, status];

    db.run(sql, params, (err) => {
        if (err) {
            console.log('Error creating booking', err.message);
            return res.status(500).json({error: 'database error'})
        }

        res.status(201).json({
            'message': 'success',
            'id': bookingId
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
            bookings: rows
        })
    })
})
module.exports = router