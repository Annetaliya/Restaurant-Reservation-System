const express = require('express');

const app = express();
const PATH = 8000;
const db = require('./database.js')

app.get('/users', (req, res, next) => {
    const sql = "select * from user "
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message })
            return;
        }
        res.json({
            "message": "OK",
            "data":rows
        })
    })
    
})

app.get('/users/:id', (req, res, next) => {
    const sql = 'select * from user where id = ?'
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return;
        }
        res.json({
            "message": "ok",
            "data": row
        })
    })
})

app.listen(PATH , () => {console.log(`app is listening on port ${PATH}`)})