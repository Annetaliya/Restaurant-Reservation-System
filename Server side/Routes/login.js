const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../database.js')

router.post('/', (req,res) => {
    const { email, password }  = req.body;

    db.get('SELECT * FROM user WHERE email = ?',
        [email], async (err, user) => {
            if (err) {
                return res.status(500).json({error: 'Database error'})
            }
            if (!user) {
                return res.status(400).json({error: 'Email not found'})
            }
            const matchPasscode = await bcrypt.compare(password, user.password);
            if (!matchPasscode) {
                return res.status(400).json({error: 'Incorrect password'})
            }
            const token = jwt.sign(
                {id: user.id, email: user.email, role: user.role},
                SECRET_KEY,
                {expiresIn: '2h'}
            )
            res.json({
                'message': 'login successfully',
                token, 
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    secondName: user.secondName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                }
            })
        }
    )
})

function authenticateToken (req, res, next) {
    const token = req.headers['authorization']
    if (!token ){
       return res.status(400).json({error: 'Access denied notoken provided'})
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({error: 'Invalid token'})
        }

        req.user = user;
        next();
    })
}

function adminAccess(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({error: 'Acess denied'})
    }
    next();
}

module.exports = router