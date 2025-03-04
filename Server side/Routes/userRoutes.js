const express = require('express');
const router = express.Router();
const db = require('../database.js')
const { v4: uuidv4 } = require('uuid')



router.get('/', (req, res, next) => {
    const sql = 'select * from user';
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error':err.message})
            return;
        }
        res.json({
            "message": "ok",
            "data": rows
        })
    })
})

router.get('/:id', (req, res, next) => {
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


router.post('/', (req, res, next) => {

    const {firstName, secondName, email, password, phone} = req.body
    if (!firstName || !email|| !password || !phone ) {
        res.status(400).json({"error": "Missing the required fields"})
    }
    const userId = uuidv4();

    const sql = 'INSERT INTO user (id, firstname, secondName, email, password, phone) values(?,?,?,?,?,?)';
    const params = [userId, firstName, secondName, email, password, phone]
    db.run(sql, params, (err, result) => {
        if(err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message":"success",
            "id": userId

        })
    })
})

router.delete('/id:', (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function(error, result) {
            if (error) {
                res.status(400).json({"error": error.message})
                return;
            }
            res.json({
                "message": "user deleted",
                changes: this.changes
            })
        }
    )
})
module.exports = router