const express = require('express');
const route = express.Router();
const db = require('../database.js');
const { v4: uuidv4 } = require('uuid')

route.get('/', (req, res) => {
    const sql = 'select * from reservations';
    const params = [];
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message})
        }
        res.json({
            "message": "success",
            "data": row
        })
    })
})

route.get('/:id', (req, res) => {
    const sql = 'select * from reservations where id = ?'
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    })

})

route.post('/', (req, res) => {
    const {tableNumber, guestNumber,status, price, floorLevel} = req.body;
    console.log("Request Body:", req.body);
    if (!tableNumber || !guestNumber || !status || !floorLevel) {
        return res.status(400).json({"Error": "Error missing required field"})
    } 
    const reservationsid = uuidv4();

    const sql = 'INSERT INTO reservations (id, tableNumber, guestNumber, price, status, floorLevel) values(?,?,?,?,?,?)';
    const params =[reservationsid, tableNumber, guestNumber, price, status, floorLevel]
    db.run(sql, params, (err, result) => {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "id": reservationsid
        })
    })

})

route.patch('/:id', (req, res) => {
    const {tableNumber, guestNumber, price, status, floorLevel} = req.body;
    const { id } = req.params;
    db.run (
        `UPDATE reservations set
        tableNumber = COALESCE(?, tableNumber),
        guestNumber = COALESCE(?, guestNumber),
        price = COALESCE(?, price),
        status =  COALESCE(?, status),
        floorLevel =  COALESCE(?, floorLevel)
        WHERE id = ?`,
        [id, tableNumber, guestNumber, price, status, floorLevel],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            if (this.changes === 0 ) {
                return res.status(400).json({"error":"reservation not found"})
            }
            res.json({
                "message": "success",
                "data": req.body
            })
        }
    )
})
module.exports = route