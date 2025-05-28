const express = require('express');
const router = express.Router();
const { getDB } = require('../database2.js')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');



router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const [rows] = await db.execute('SELECT * FROM users');
        res.json({message: 'ok', data: rows})

    } catch (error) {
        res.status(500).json({error: error.message})

    }
   
})

router.get('/:id', async (req, res) => {
    try {
        const db = getDB();
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id])
        res.json({message: 'ok', data: rows[0]})

    } catch (err) {
        res.status(500).json({ error: err.message})

    }
    
})


router.post('/', async (req, res) => {

    const {firstName, secondName, email, password, confirmPassword, phone, role} = req.body
    const userRole  = role || 'user';
    if (!firstName || !email|| !password || !phone ) {
        res.status(400).json({"error": "Missing the required fields"})
    }
    if (password !== confirmPassword) {
        return res.status(400).json({message: 'password does not match'})
    }
    const userId = uuidv4();
     
    try {
        const db = getDB();
        const hashedPassword = await bcrypt.hash(password, 10)
        const sql = 'INSERT INTO users (id, firstname, secondName, email, password, phone, role) values(?,?,?,?,?,?,?)';
        const params = [userId, firstName, secondName, email, hashedPassword, phone, userRole]
        await db.execute(sql, params);
        res.json({message: 'successs', id: userId})

    } catch (err) {
        res.status(500).json({ error: err.message})

    }
})

router.delete('/id:', async (req, res) => {
    try {
        const db = getDB();
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [req.params.id])
        res.json({message: "user deleted", affectedRows: result.affectedRows})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
    
})
module.exports = router