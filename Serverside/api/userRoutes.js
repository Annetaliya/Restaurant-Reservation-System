const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');
const supabase = require('../supaBaseClient.js');



router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            throw new Error(error.message)
        }
        res.json({message: 'ok', data})

    } catch (error) {
        res.status(500).json({error: error.message})

    }
   
})

router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error) {
            throw new Error(error.message)
        }
        res.json({message: 'ok', data})

    } catch (err) {
        res.status(500).json({ error: err.message})

    }
    
})


router.post('/', async (req, res) => {

    const {first_name, second_name, email, password, confirmPassword, phone, role} = req.body
    const userRole  = role || 'user';
    if (!first_name || !email|| !password || !phone ) {
        res.status(400).json({"error": "Missing the required fields"})
    }
    if (password !== confirmPassword) {
        return res.status(400).json({message: 'password does not match'})
    }


     
    try {
        const { data, error: signUpError } =  await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })

        if (signUpError) {
            throw new Error(signUpError.message)
        }
        
        const userId = data.user.id;
        const { error } =  await supabase.from('users').insert([
            {
                id: userId,
                first_name,
                second_name,
                email,
                password,
                phone,
                role: userRole
            }
        ])
        if (error) {
            throw new Error(error.message)
        }
        
        res.json({message: 'successs', id: userId})

    } catch (err) {
        res.status(500).json({ error: err.message})

    }
})

router.delete('/id:', async (req, res) => {
    try {
        const {data, error } = await supabase
                .from('users')
                .delete()
                .eq('id', req.params.id);
        
        if (error) {
            throw new Error(error.message)

        }
        
        res.json({message: "user deleted", data})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
    
})
module.exports = router