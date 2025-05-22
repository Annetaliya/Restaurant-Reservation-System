const express = require('express');
const route = express.Router();
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../database2.js')

route.get('/', async (req, res) => {
    
    try {
        const db = getDB();
       const [rows] =  await db.execute('SELECT * FROM reservations')
       res.json({ message: 'sucsess', data: rows})

    } catch (err) {
        console.log('error fetching reservations:', err.message)
        res.status(500).json({error: err.message})

    }
   
})

route.get('/:id', async (req, res) => {
   
    try {
        const db = getDB();
        const [rows] = await db.execute('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
        res.json({message: 'success', data: rows[0]})

    } catch (err) {
        console.log('Error getting reservation:', err.message)
        res.status(500).json({error: err.message})


    }
  

})

route.post('/', async (req, res) => {
    const {tableNumber, guestNumber,status, price, floorLevel} = req.body;
    console.log("Request Body:", req.body);
    if (!tableNumber || !guestNumber || !status || !floorLevel) {
        return res.status(400).json({"Error": "Error missing required field"})
    } 
    const reservationsid = uuidv4();
    try {
        const db = getDB();
         const sql = 'INSERT INTO reservations (id, tableNumber, guestNumber, price, status, floorLevel) values(?,?,?,?,?,?)';
         const params =[reservationsid, tableNumber, guestNumber, price, status, floorLevel]
         await db.execute(sql, params);
         res.json({
            message: "success",
            id: reservationsid
         })


    } catch (err) {
        console.log('Error posting a reservation table:', err.message)
        res.status(500).json({ error: err.message})

    }
   
})

route.patch('/:id', async (req, res) => {
    const {status} = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).json({error: 'no fields to update'})
    }
  
    try {
        const db = getDB();
        const sql = `UPDATE reservations SET status = ? WHERE id = ?`
        const [result] = await db.execute(sql, [status, id]);
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Reservation not found'})
        }
        res.json({message: 'reservations updated', reservationId: id })

    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database error' });

    }
})
module.exports = route