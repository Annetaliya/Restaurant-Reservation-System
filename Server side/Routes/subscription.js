const express = require('express');
const route = express.Router();
const db = require('../database.js');
const { v4: uuidv4 } = require('uuid')

route.post('/subscribe', (req, res) => {
    const subscription = JSON.stringify(req.body);
    const id = uuidv4();

    const sql = `INSERT INTO subscriptions (id, subscription) VALUES (?,?)`
    db.run(sql, [id, subscription], function(err){
        if (err) {
            console.log(err.message)
            return res.status(500).json({error: 'Database Error'})
        }
        res.status(201).json({message: 'Subscription Saved'})

    })
})