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
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (authError) {
            console.log("Supabase auth error:", authError.message);
        }
                
        if (!authData.session) {
            console.log("No session returned. Auth data:", authData);
        }
        const userId = authData.user.id;

        const {data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('id, first_name, second_name, email, phone, role')
            .eq('id', userId)
            .single();

        if (profileError) {
            return res.status(500).json({ error: 'Could not fetch user profile'})
        }

        const customToken = jwt.sign(userProfile, SECRET_KEY, { expiresIn: '1h' })

       res.json({
        message: 'Login successful',
        user: userProfile,
        token: customToken,
       
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