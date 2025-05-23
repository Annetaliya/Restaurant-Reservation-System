const express = require('express');
const route = express.Router();
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../database2.js');


route.post('/', async (req, res) => {
    const subscriptions = JSON.stringify(req.body);
    const id = uuidv4();
    const db = getDB();

    try {
        await db.execute(`INSERT INTO subscriptions (id, subscriptions) VALUES (?,?)`, [id, subscriptions])
        res.json({
            message: 'Subscription Saved'

        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({error: 'Database Error'})
    }

})

module.exports = route