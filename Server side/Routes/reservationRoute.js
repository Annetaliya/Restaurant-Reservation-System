const express = require('express');
const route = express.Router();
const db = require('../database.js')

route.get('/', (req, res, next) => {
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

module.exports = route