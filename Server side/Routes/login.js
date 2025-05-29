const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const supabase = require('../supaBaseClient.js');




router.post('/', async (req,res) => {
    const { email, password }  = req.body;
    try {
        const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
        if (error || !data) {
            return res.status(400).json({error: 'Email not found'})
        }
        const user = data;

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect password' })

        }

        const token = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        req.session.user = {
            id: user.id,
            token: token,
            role: user.role
        }
        res.json({
            message: 'Login successfully',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

        })

    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ error: 'Database error' });

    }

})

router.post('/logout', (req, res) => {
    req.session.destroy(err =>{
        if (err) {
            console.log(err)
            return res.status(500).json({message: 'Logout failed'})
        }
        res.clearCookie('connect.sid')
        res.json({message: 'Logout successful'})
    })
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